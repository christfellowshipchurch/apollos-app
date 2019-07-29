import React from 'react';
import { ScrollView } from 'react-native';
import {
  styled,
  H2,
  H5,
  PaddedView,
  FlexedSafeAreaView,
  BackgroundView
} from '@apollosproject/ui-kit'

const TitleText = styled(
  ({ theme }) => ({
    color: theme.colors.primary,
  }),
  'ui-auth.TitleText'
)(H2);

const PromptText = styled(
  ({ theme }) => ({
    color: theme.colors.text.secondary,
  }),
  'ui-auth.PromptText'
)(H5);

const GeneratePolicy = () => {
  let policy = "Blah blah blah bleebidy bloobidy do."

  for (var i = 0; i < 30; i++) {
    policy = `${policy} Blah blah blah bleebidy bloobidy do.`
  }

  return policy
}

const PrivacyPolicy = () => {
  return (
    <BackgroundView>
      <ScrollView>
        <PaddedView>
          <TitleText>Privacy Policy</TitleText>
          <PromptText>
            <GeneratePolicy />
          </PromptText>
        </PaddedView>
      </ScrollView>
    </BackgroundView>
  )
}

PrivacyPolicy.navigationOptions = {
  title: 'Privacy Policy',
  headerMode: 'screen'
}

export default PrivacyPolicy