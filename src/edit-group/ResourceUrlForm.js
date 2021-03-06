import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

import {
  styled,
  BodySmall,
  Button,
  Card,
  CardContent,
  H4,
} from '@apollosproject/ui-kit';

import { TextInput } from '../ui/inputs';

import { useForm } from '../hooks';

import { ResourceShape } from './EditGroupPropTypes';

const FORM_ERRORS = Object.freeze({
  GENERIC: 'Something went wrong. Please try again.',
  ALREADY_EXISTS: 'A resource with that URL already exists',
});

// :: Styled Components
// ------------------------------------------------------------------

const FormTitle = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(H4);

const ErrorText = styled(({ theme }) => ({
  color: theme.colors.alert,
}))(BodySmall);

const ButtonsRow = styled(({ theme }) => ({
  flex: 1,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: theme.sizing.baseUnit,
}))(View);

// :: Core Component
// ------------------------------------------------------------------

const ResourceUrlForm = (props) => {
  const { values, setValue } = useForm({
    defaultValues: {
      title: '',
      url: '',
    },
  });

  // Initialize a list of existing resource URLs for quicker validation logic
  const [resourceUrls] = useState(
    props.existingResources
      .map(({ relatedNode }) => get(relatedNode, 'url', null))
      .filter((string) => Boolean(string))
  );
  const [error, setError] = useState(null);
  const formIsValid =
    (!error || error === FORM_ERRORS.GENERIC) &&
    !isEmpty(values.title) &&
    !isEmpty(values.url);

  useEffect(
    () => {
      if (resourceUrls.includes(values.url)) {
        setError(FORM_ERRORS.ALREADY_EXISTS);
      } else {
        setError(null);
      }
    },
    [values]
  );

  const handleSubmit = async () => {
    try {
      await props.onSubmit(values);
    } catch (submitError) {
      setError(FORM_ERRORS.GENERIC);
    }
  };

  return (
    <Card>
      <CardContent>
        <FormTitle>Add a Link Resource</FormTitle>
        <TextInput
          label="Title"
          hidePrefix
          value={values.title}
          onChangeText={(newTitle) => setValue('title', newTitle)}
          returnKeyType="done"
        />
        <TextInput
          label="Link (URL)"
          hidePrefix
          value={values.url}
          onChangeText={(newUrl) => setValue('url', newUrl)}
          returnKeyType="done"
          error={error}
          hideErrorText
          errorIndicator={Boolean(error)}
          autoCapitalize={false}
        />
        {error && <ErrorText bold>{error}</ErrorText>}
        <ButtonsRow>
          <Button
            type="secondary"
            bordered
            pill={false}
            title="Cancel"
            onPress={props.onCancel}
          />
          <Button
            pill={false}
            title="Done"
            disabled={!formIsValid}
            onPress={handleSubmit}
          />
        </ButtonsRow>
      </CardContent>
    </Card>
  );
};

ResourceUrlForm.propTypes = {
  existingResources: PropTypes.arrayOf(ResourceShape).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ResourceUrlForm;
