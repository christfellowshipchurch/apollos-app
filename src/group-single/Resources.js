import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useApolloClient } from '@apollo/react-hooks';

import {
  Button,
  PaddedView,
  H4,
  styled,
  ThemeMixin,
} from '@apollosproject/ui-kit';
import { useLinkRouter } from '../hooks';

const GROUP_RESOURCE_INTERACTION = gql`
  mutation($nodeId: ID!, $action: InteractionAction!) {
    interactWithNode(nodeId: $nodeId, action: $action) {
      success
    }
  }
`;

const StyledH4 = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(H4);

const StyledButton = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(Button);

const Resources = ({ resources, isLoading, navigation }) => {
  const { routeLink } = useLinkRouter();
  const client = useApolloClient();
  const resourceInteraction = (relatedNode, action) =>
    client.mutate({
      mutation: GROUP_RESOURCE_INTERACTION,
      variables: {
        nodeId: relatedNode.id,
        action: `GROUP_${action}`,
      },
    });
  return (
    <PaddedView>
      <StyledH4>{'Resources'}</StyledH4>
      {resources.map(({ id, relatedNode, action, title }) => {
        const handleOnPress = () => {
          resourceInteraction(relatedNode, action);
          if (action === 'READ_CONTENT') {
            navigation.navigate('ContentSingle', {
              itemId: relatedNode.id,
              transitionKey: 2,
            });
          }
          if (action === 'READ_EVENT') {
            navigation.navigate('Event', {
              eventId: relatedNode.id,
              transitionKey: 2,
            });
          }
          if (action === 'READ_PRAYER') {
            navigation.navigate('PrayerRequestSingle', {
              prayerRequestId: relatedNode.id,
              transitionKey: 2,
            });
          }
          if (action === 'READ_GROUP') {
            navigation.navigate('GroupSingle', {
              itemId: relatedNode.id,
              transitionKey: 2,
            });
          }
          if (action === 'OPEN_URL') {
            routeLink(relatedNode.url, { nested: true });
          }
        };
        return (
          <ThemeMixin
            mixin={{ colors: { primary: 'rgba(120, 120, 128, 0.36)' } }}
            key={id}
          >
            <StyledButton
              onPress={() => handleOnPress()}
              type={'ghost'}
              bordered
              loading={isLoading}
              pill={false}
            >
              <H4>{title}</H4>
            </StyledButton>
          </ThemeMixin>
        );
      })}
    </PaddedView>
  );
};

Resources.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
      contentChannelItem: PropTypes.string,
      relatedNode: PropTypes.shape({
        id: PropTypes.string,
      }),
      action: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  client: PropTypes.shape({
    mutate: PropTypes.func,
  }).isRequired,
};

export default Resources;
