import React from 'react';
import PropTypes from 'prop-types';
import { styled, Button, NavigationService } from '@apollosproject/ui-kit';

const StyledButton = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(Button);

const GroupChatButton = ({ isLoading }) => (
  <StyledButton
    onPress={() => NavigationService.navigate('Channel', { nested: true })}
    loading={isLoading}
    title={'Message Group'}
    type={'primary'}
    pill={false}
  />
);

GroupChatButton.propTypes = {
  isLoading: PropTypes.bool,
};

export default GroupChatButton;