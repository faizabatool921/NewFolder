import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const customColors = [
  "#2E163A", "#183C69", "#2563EB", "#7C3AED",
  "#16A34A", "#DC2626", "#B45309", "#0F766E",
  "#9D174D", "#1E3A5F", "#312E81", "#064E3B",
];

const stampIcons = ["☕", "🛍️", "🍔", "👕", "💊", "🍕", "💇", "🏋️"];

const redemptionOptions = [
  { label: "Cashback",    sub: "100 pts = Rs.10", icon: "dollar-sign" },
  { label: "Tier Reward", sub: "Gold / Silver",   icon: "award"       },
  { label: "% Discount",  sub: "15% OFF",         icon: "percent"     },
  { label: "Custom",      sub: "Custom Rule",     icon: "edit-3"      },
];

// config = { color, customHex, icon, redemption, totalStamps, stampsPerVisit,
//            minSpend, expiryDays, ptsPerRs, minSpendAmt, rewardThreshold, expiryAmt }
// onChange(key, value) — parent (CardSetup) state update karta hai
const RewardPreview = ({ cardType, businessName, config, onChange }) => {

  const [editOpen, setEditOpen] = useState(false);

  const activeColor = config.customHex.length === 7 ? config.customHex : config.color;
  const pointsGradient = [activeColor, activeColor];
  const amountGradient = [activeColor, activeColor];

  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 25, padding: 18 }}>

      {/* Header */}
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#222", marginBottom: 4 }}>
        Your Card
      </Text>
      <Text style={{ fontSize: 13, color: "#999", marginBottom: 14 }}>
        {cardType === "points" ? "Customer view · Points card" : "Customer view · Amount card"}
      </Text>

      {/* ── POINTS CARD TEMPLATE ── */}
      {cardType === "points" && (
        <LinearGradient
          colors={pointsGradient}
          style={{ borderRadius: 20, padding: 16 }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              {businessName}
            </Text>
            <Text style={{ fontSize: 24 }}>{config.icon}</Text>
          </View>

          <Text style={{ color: "#C9B5E5", marginTop: 14, fontSize: 12 }}>Reward Points</Text>
          <Text style={{ color: "#FFB347", fontSize: 28, fontWeight: "bold" }}>0</Text>

          <View style={{ flexDirection: "row", marginTop: 10, flexWrap: "wrap" }}>
            {Array.from({ length: Math.min(parseInt(config.totalStamps) || 10, 20) }).map((_, item) => (
              <View
                key={item}
                style={{
                  width: 18, height: 18, borderRadius: 9,
                  marginRight: 4, marginBottom: 4,
                  backgroundColor: "#74558D",
                }}
              />
            ))}
          </View>

          <Text style={{ color: "#fff", marginTop: 8, fontWeight: "600", fontSize: 12 }}>
            0 / {config.totalStamps} Stamps Collected
          </Text>
          <Text style={{ color: "#C9B5E5", marginTop: 4, fontSize: 11 }}>
            Buy {config.totalStamps} Coffees, Get 1 Free
          </Text>
        </LinearGradient>
      )}

      {/* ── AMOUNT CARD TEMPLATE ── */}
      {cardType === "amount" && (
        <LinearGradient
          colors={amountGradient}
          style={{ borderRadius: 20, padding: 16 }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              {businessName}
            </Text>
            <Text style={{ fontSize: 24 }}>{config.icon}</Text>
          </View>

          <Text style={{ color: "#C5D4E8", marginTop: 14, fontSize: 12 }}>Total Points</Text>
          <Text style={{ color: "#37E0A4", fontSize: 28, fontWeight: "bold" }}>0 pts</Text>

          <View style={{ marginTop: 12, height: 10, backgroundColor: "#5479A8", borderRadius: 10 }}>
            <View style={{ width: "0%", height: 10, backgroundColor: "#37E0A4", borderRadius: 10 }} />
          </View>

          <Text style={{ color: "#fff", marginTop: 8, fontSize: 12 }}>
            0 / {config.rewardThreshold} pts
          </Text>
          <Text style={{ color: "#C5D4E8", marginTop: 4, fontSize: 11 }}>
                         Earn 1 point per Rs. {config.rsPerPoint} spent
          </Text>
        </LinearGradient>
      )}

      {/* ── EDIT CARD DESIGN BUTTON ── */}
      <TouchableOpacity
        onPress={() => setEditOpen(!editOpen)}
        style={{
          marginTop: 14,
          backgroundColor: "#EEF3FF",
          borderRadius: 15,
          paddingVertical: 13,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather name="edit-3" size={18} color="#4F46E5" />
        <Text style={{ marginLeft: 8, color: "#4F46E5", fontWeight: "bold" }}>
          Edit Card Design
        </Text>
        <Feather
          name={editOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color="#4F46E5"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>

      {/* ══════════════════════════════════════
           EDIT PANEL
      ══════════════════════════════════════ */}
      {editOpen && (
        <View style={{
          marginTop: 14,
          backgroundColor: "#F8F9FF",
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: "#E0E7FF",
        }}>

          {/* ── 1. Background Color ── */}
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#222", marginBottom: 10 }}>
            Card Color
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
            {customColors.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => { onChange('color', c); onChange('customHex', ''); }}
                style={{
                  width: 32, height: 32, borderRadius: 16,
                  backgroundColor: c, marginRight: 8, marginBottom: 8,
                  borderWidth: config.color === c && config.customHex === "" ? 3 : 1,
                  borderColor: config.color === c && config.customHex === "" ? "#4F46E5" : "rgba(0,0,0,0.1)",
                }}
              />
            ))}
          </View>

          {/* Custom hex input */}
          <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>
            Custom Color (hex code)
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{
              width: 36, height: 36, borderRadius: 8,
              backgroundColor: config.customHex.length === 7 ? config.customHex : "#F4F5FA",
              borderWidth: 1, borderColor: "#D1D5DB", marginRight: 10,
            }} />
            <TextInput
              placeholder="#e.g. #FF5733"
              value={config.customHex}
              onChangeText={(text) => onChange('customHex', text)}
              maxLength={7}
              style={{
                flex: 1, backgroundColor: "#fff", borderRadius: 10,
                padding: 10, borderWidth: 1, borderColor: "#D1D5DB", fontSize: 14,
              }}
            />
          </View>

          {/* ── 2. Business Logo / Icon ── */}
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#222", marginBottom: 10 }}>
            Business Logo / Icon
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
            {stampIcons.map((icon) => (
              <TouchableOpacity
                key={icon}
                onPress={() => onChange('icon', icon)}
                style={{
                  width: 46, height: 46, borderRadius: 10,
                  backgroundColor: config.icon === icon ? "#EEF3FF" : "#F7F8FB",
                  justifyContent: "center", alignItems: "center",
                  marginRight: 8, marginBottom: 8,
                  borderWidth: config.icon === icon ? 2 : 0,
                  borderColor: "#4F46E5",
                }}
              >
                <Text style={{ fontSize: 20 }}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Upload logo */}
          <TouchableOpacity
            style={{
              borderWidth: 1, borderStyle: "dashed", borderColor: "#D1D5DB",
              borderRadius: 12, padding: 14, alignItems: "center", marginBottom: 16,
            }}
          >
            <Feather name="upload" size={20} color="#4F46E5" />
            <Text style={{ marginTop: 5, color: "#666", fontSize: 13 }}>Upload Business Logo</Text>
            <Text style={{ fontSize: 11, color: "#999", marginTop: 2 }}>PNG or SVG, max 2MB</Text>
          </TouchableOpacity>

          <View style={{ height: 1, backgroundColor: "#E5E7EB", marginBottom: 16 }} />

          {/* ── 3. STAMP SETUP (points card only) ── */}
          {cardType === "points" && (
            <>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#222", marginBottom: 10 }}>
                Stamp Setup
              </Text>

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
               <View style={{ width: "48%" }}>
  <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>
    Total Stamps Required
  </Text>
  <TextInput
    value={config.totalStamps}
    onChangeText={(text) => onChange("totalStamps", text)}
    keyboardType="numeric"
    style={{
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      fontSize: 14,
    }}
  />
</View>
                <View style={{ width: "48%" }}>
                  <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Stamps Per Visit</Text>
                  <TextInput
                    value={config.stampsPerVisit}
                    onChangeText={(text) => onChange('stampsPerVisit', text)}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: "#fff", borderRadius: 10,
                      padding: 12, borderWidth: 1, borderColor: "#E5E7EB", fontSize: 14,
                    }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12, marginBottom: 16 }}>
                <View style={{ width: "48%" }}>
                  <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Min Spend (Rs.)</Text>
                  <TextInput
                    value={config.minSpend}
                    onChangeText={(text) => onChange('minSpend', text)}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: "#fff", borderRadius: 10,
                      padding: 12, borderWidth: 1, borderColor: "#E5E7EB", fontSize: 14,
                    }}
                  />
                </View>
                <View style={{ width: "48%" }}>
                  <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Expiry (days)</Text>
                  <TextInput
                    value={config.expiryDays}
                    onChangeText={(text) => onChange('expiryDays', text)}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: "#fff", borderRadius: 10,
                      padding: 12, borderWidth: 1, borderColor: "#E5E7EB", fontSize: 14,
                    }}
                  />
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: "#E5E7EB", marginBottom: 16 }} />
            </>
          )}

          {/* ── 4. SPEND SETUP (amount card only) ── */}
          {cardType === "amount" && (
            <>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#222", marginBottom: 10 }}>
                Spend Setup
              </Text>

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ width: "48%" }}>
                  <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Points Per Rs.</Text>
                  <TextInput
  value={config.rsPerPoint}
  onChangeText={(text) => onChange("rsPerPoint", text)}
  keyboardType="numeric"
  style={{
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14,
  }}
/>
                </View>
                <View style={{ width: "48%" }}>
                  <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Min Spend (Rs.)</Text>
                  <TextInput
                    value={config.minSpendAmt}
                    onChangeText={(text) => onChange('minSpendAmt', text)}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: "#fff", borderRadius: 10,
                      padding: 12, borderWidth: 1, borderColor: "#E5E7EB", fontSize: 14,
                    }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12, marginBottom: 16 }}>
                <View style={{ width: "48%" }}>
                  <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Reward Threshold</Text>
                  <TextInput
                    value={config.rewardThreshold}
                    onChangeText={(text) => onChange('rewardThreshold', text)}
                    style={{
                      backgroundColor: "#fff", borderRadius: 10,
                      padding: 12, borderWidth: 1, borderColor: "#E5E7EB", fontSize: 14,
                    }}
                  />
                </View>
                <View style={{ width: "48%" }}>
                  <Text style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>Expiry (days)</Text>
                  <TextInput
                    value={config.expiryAmt}
                    onChangeText={(text) => onChange('expiryAmt', text)}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: "#fff", borderRadius: 10,
                      padding: 12, borderWidth: 1, borderColor: "#E5E7EB", fontSize: 14,
                    }}
                  />
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: "#E5E7EB", marginBottom: 16 }} />
            </>
          )}

          {/* ── 5. REDEMPTION RULE ── */}
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#222", marginBottom: 10 }}>
            Redemption Rule
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {redemptionOptions.slice(0, 2).map((r) => (
              <TouchableOpacity
                key={r.label}
                onPress={() => onChange('redemption', r.label)}
                style={{
                  width: "48%",
                  backgroundColor: config.redemption === r.label ? "#EEF3FF" : "#fff",
                  borderWidth: config.redemption === r.label ? 2 : 1,
                  borderColor: config.redemption === r.label ? "#4F46E5" : "#E5E7EB",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <Feather
                  name={r.icon}
                  size={20}
                  color={config.redemption === r.label ? "#4F46E5" : "#666"}
                />
                <Text style={{
                  fontWeight: "bold", marginTop: 6, fontSize: 13,
                  color: config.redemption === r.label ? "#4F46E5" : "#222",
                }}>
                  {r.label}
                </Text>
                <Text style={{ color: "#666", fontSize: 11, marginTop: 2 }}>{r.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            {redemptionOptions.slice(2, 4).map((r) => (
              <TouchableOpacity
                key={r.label}
                onPress={() => onChange('redemption', r.label)}
                style={{
                  width: "48%",
                  backgroundColor: config.redemption === r.label ? "#EEF3FF" : "#fff",
                  borderWidth: config.redemption === r.label ? 2 : 1,
                  borderColor: config.redemption === r.label ? "#4F46E5" : "#E5E7EB",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <Feather
                  name={r.icon}
                  size={20}
                  color={config.redemption === r.label ? "#4F46E5" : "#666"}
                />
                <Text style={{
                  fontWeight: "bold", marginTop: 6, fontSize: 13,
                  color: config.redemption === r.label ? "#4F46E5" : "#222",
                }}>
                  {r.label}
                </Text>
                <Text style={{ color: "#666", fontSize: 11, marginTop: 2 }}>{r.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      )}

    </View>
  );
};

export default RewardPreview;