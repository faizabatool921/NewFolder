import { Feather } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';

// Same card-type rule as Reward.js


const isStampCardType = (cardType) => {
  const type = String(cardType || 'points')
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_');

  return [
    'points',
    'stamp',
    'stamps',
    'stamp_card',
    'stamps_card',
    'visit',
    'visit_card',
  ].includes(type);
};


const RewardCard = ({
  businessName,
  points = 0,
  progress = 0,
  total = 10,
  cardType = 'points',
  bgColor = '#2e163a',
  rewardType = 'Reward',
  logo = null,
  rewardsEarned = 0,

  // Stamp card settings
  stampsPerVisit = 1,
  minimumSpend = 0,
  expiryDays = 180,

  // Amount/Points card settings
  rsPerPoint = 100,
  rewardThreshold = 500,
}) => {
  // FIX: points/amount cards show Amount Setup.
  // Stamp/visit cards show Stamp Setup.
  const isStampCard = isStampCardType(cardType);

  const safeTotal = Math.max(Number(total) || 1, 1);
  const safeProgress = Math.min(
    Math.max(Number(progress) || 0, 0),
    safeTotal
  );

  const percentage = Math.min(
    (safeProgress / safeTotal) * 100,
    100
  );

  const InfoRow = ({ label, value }) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 9,
      }}
    >
      <Text style={{ color: '#DDDDDD', fontSize: 12 }}>
        {label}
      </Text>

      <Text
        style={{
          color: '#FF9A44',
          fontSize: 12,
          fontWeight: 'bold',
        }}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: bgColor || '#2e163a',
        borderRadius: 22,
        padding: 16,
        marginVertical: 8,
      }}
    >
      {/* Business Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 22,
              backgroundColor: '#ffffff26',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
              overflow: 'hidden',
            }}
          >
            {logo ? (
              <Image
                source={{ uri: logo }}
                style={{ width: 42, height: 42 }}
                resizeMode="cover"
              />
            ) : (
              <Feather
                name="shopping-bag"
                size={21}
                color="#FF9A44"
              />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              {businessName}
            </Text>

            <Text
              style={{
                color: '#DDDDDD',
                fontSize: 11,
                marginTop: 3,
              }}
            >
              {isStampCard
                ? 'Stamp / Visit Card'
                : 'Amount / Points Card'}
            </Text>
          </View>
        </View>

        <Feather name="gift" size={22} color="#FF9A44" />
      </View>

      {/* Earned Progress */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ color: '#DDDDDD', fontSize: 13 }}>
          {isStampCard
            ? 'Total Stamps Earned'
            : 'Total Points Earned'}
        </Text>

        <Text
          style={{
            color: '#FF9A44',
            fontSize: 25,
            fontWeight: 'bold',
            marginTop: 3,
          }}
        >
          {points}
        </Text>
      </View>

      {/* Progress Display */}
      {isStampCard ? (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 16,
          }}
        >
          {Array.from({
            length: Math.min(safeTotal, 30),
          }).map((_, index) => (
            <View
              key={index}
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                marginRight: 7,
                marginBottom: 7,
                backgroundColor:
                  index < safeProgress
                    ? '#FF9A44'
                    : '#ffffff30',
                borderWidth: 1,
                borderColor: '#ffffff50',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {index < safeProgress && (
                <Feather
                  name="check"
                  size={13}
                  color="#2e163a"
                />
              )}
            </View>
          ))}
        </View>
      ) : (
        <View
          style={{
            height: 9,
            backgroundColor: '#ffffff30',
            borderRadius: 8,
            overflow: 'hidden',
            marginTop: 18,
          }}
        >
          <View
            style={{
              height: 9,
              width: `${percentage}%`,
              backgroundColor: '#FF9A44',
              borderRadius: 8,
            }}
          />
        </View>
      )}

      {/* Card-Specific Settings */}
      {/* <View
        style={{
          backgroundColor: '#ffffff12',
          borderRadius: 14,
          padding: 12,
          marginTop: 16,
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 'bold',
            marginBottom: 3,
          }}
        >
          {isStampCard ? 'Stamp Setup' : 'Amount Setup'}
        </Text>

        {isStampCard ? (
          <>
            <InfoRow
              label="Total Stamps"
              value={safeTotal}
            />

            <InfoRow
              label="Stamps per Visit"
              value={stampsPerVisit}
            />

            <InfoRow
              label="Minimum Spend"
              value={`Rs. ${Number(minimumSpend) || 0}`}
            />

            <InfoRow
              label="Expiry"
              value={`${expiryDays} days`}
            />
          </>
        ) : (
          <>
            <InfoRow
              label="Rs. per Point"
              value={`Rs. ${rsPerPoint}`}
            />

            <InfoRow
              label="Minimum Spend"
              value={`Rs. ${Number(minimumSpend) || 0}`}
            />

            <InfoRow
              label="Reward Threshold"
              value={`${rewardThreshold} points`}
            />

            <InfoRow
              label="Expiry"
              value={`${expiryDays} days`}
            />
          </>
        )}
      </View> */}

      {/* Bottom Row */}
      <View
        style={{
          marginTop: 13,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#E0E0E0',
            fontSize: 12,
            flex: 1,
          }}
        >
          {rewardType}
        </Text>

        <Text
          style={{
            color: '#FF9A44',
            fontSize: 12,
            fontWeight: 'bold',
            marginLeft: 8,
          }}
        >
          {safeProgress}/{safeTotal}
        </Text>
      </View>

      {rewardsEarned > 0 && (
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 12,
            marginTop: 8,
          }}
        >
          Rewards earned: {rewardsEarned}
        </Text>
      )}
    </View>
  );
};

export default RewardCard;