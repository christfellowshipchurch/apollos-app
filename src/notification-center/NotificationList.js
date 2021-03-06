import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { withProps } from 'recompose';

import { View } from 'react-native';
import {
  BackgroundView,
  H3,
  styled,
  CenteredView,
  withMediaQuery,
  FlexedView,
  Card,
  CardContent,
} from '@apollosproject/ui-kit';

import ThemeMixin from 'ui/DynamicThemeMixin';
import { HorizontalDivider } from 'ui/Dividers';
import { CardFeed } from 'ui/CardFeeds';
import NotificationAlert from './NotificationAlert';
import { DateLabel, Title, Subtitle, Content } from './styles';

const Spacer = styled(({ theme, asCard }) => ({
  paddingTop: theme.sizing.baseUnit,
  paddingHorizontal: asCard ? 0 : theme.sizing.baseUnit,
  flex: 1,
}))(View);

const StyledHorizontalDivider = styled(({ theme }) => ({
  width: '100%',
}))(HorizontalDivider);

const NotificationPreview = ({
  title,
  subtitle,
  body,
  date,
  isLoading,
  asCard,
}) => {
  const BodyContent = () => (
    <View>
      <DateLabel date={date} isLoading={isLoading} />
      <Title isLoading={isLoading}>{title}</Title>
      <Subtitle ellipsizeMode="tail" numberOfLines={1} isLoading={isLoading}>
        {subtitle}
      </Subtitle>
      <Content ellipsizeMode="tail" numberOfLines={2} isLoading={isLoading}>
        {body}
      </Content>
    </View>
  );

  return asCard ? (
    <Card>
      <CardContent>
        <BodyContent />
      </CardContent>
    </Card>
  ) : (
    <FlexedView>
      <BodyContent />
    </FlexedView>
  );
};

NotificationPreview.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  body: PropTypes.string,
  date: PropTypes.string,
  isLoading: PropTypes.bool,
  asCard: PropTypes.bool,
};

const ListEmptyComponent = () => (
  <CenteredView>
    <Subtitle padded>You're all caught up!</Subtitle>
  </CenteredView>
);

const NotificationList = ({
  notifications,
  isLoading,
  refetch,
  error,
  asCard,
}) => {
  const navigation = useNavigation();
  const [activeNotification, setActiveNotification] = useState(false);
  const ListItemComponent = (props) => (
    <NotificationPreview asCard={asCard} {...props} />
  );

  return (
    <ThemeMixin>
      <BackgroundView>
        <NotificationAlert
          show={!!activeNotification}
          showProgress={false}
          onDismiss={() => setActiveNotification(false)}
          onPressClose={() => setActiveNotification(false)}
          notification={activeNotification}
        />
        <Spacer asCard={asCard}>
          <CardFeed
            content={notifications}
            CardComponent={ListItemComponent}
            ItemSeparatorComponent={
              asCard ? () => null : StyledHorizontalDivider
            }
            onPressItem={(item) => {
              if (!item.isLoading) {
                navigation.navigate('NotificationSingle', {
                  itemId: item.id,
                });
              }
            }}
            showsVerticalScrollIndicator={false}
            hasContent={notifications.length > 1}
            ListEmptyComponent={ListEmptyComponent}
            isLoading={isLoading}
            refetch={refetch}
            error={error}
          />
        </Spacer>
      </BackgroundView>
    </ThemeMixin>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
      body: PropTypes.string,
      date: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
  refetch: PropTypes.func,
  asCard: PropTypes.bool,
};

NotificationList.defaultProps = {
  notifications: [],
  isLoading: false,
  refetch: () => true,
  asCard: false,
};

export default withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  withProps(() => ({
    asCard: false,
  })),
  withProps(() => ({
    asCard: true,
  }))
)(NotificationList);
