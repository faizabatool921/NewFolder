import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

// Custom color picker options
const customColors = ["#2563EB", "#7C3AED", "#16A34A", "#DC2626", "#312E81", "#B45309", "#0F766E", "#9D174D"];

const AmountCard = () => {

  const [selectedColor, setSelectedColor]           = useState("#2563EB");
  const [selectedIcon, setSelectedIcon]             = useState("☕");
  const [selectedRedemption, setSelectedRedemption] = useState("Cashback");

  const stampIcons = ["☕", "🛍️", "🍔", "👕", "💊", "🍕", "💇", "🏋️"];

  const redemptionOptions = [
    { label: "Cashback",    sub: "100 pts = Rs.10", icon: "dollar-sign", col: "#2563EB" },
    { label: "% Discount",  sub: "15% OFF",         icon: "percent",     col: "#666"   },
    { label: "Custom",      sub: "Custom Rule",     icon: "edit-3",      col: "#666"   },
  ];

  const handleUploadLogo = () => {
    Alert.alert("Upload Logo", "Connect your image picker library here (e.g. expo-image-picker).");
  };

  return (
    <>

      {/* ── CARD PRIMARY COLOR ── */}
      <View style={{ backgroundColor: "#fff", padding: 18, borderRadius: 20, marginTop: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#222" }}>
          Card Primary Color
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
          {customColors.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setSelectedColor(c)}
              style={{
                width: 34, height: 34, borderRadius: 17,
                backgroundColor: c, marginRight: 10, marginBottom: 8,
                borderWidth: selectedColor === c ? 3 : 1,
                borderColor: selectedColor === c ? "#2563EB" : "rgba(0,0,0,0.1)",
              }}
            />
          ))}
          {/* Custom color picker button */}
          <TouchableOpacity
            style={{
              width: 34, height: 34, borderRadius: 17,
              backgroundColor: "#F4F5FA", marginRight: 10, marginBottom: 8,
              borderWidth: 1, borderColor: "#D1D5DB",
              justifyContent: "center", alignItems: "center",
            }}
          >
            <Feather name="sliders" size={15} color="#666" />
          </TouchableOpacity>
        </View>
        {/* Show selected color */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: selectedColor, marginRight: 8 }} />
          <Text style={{ fontSize: 12, color: "#666" }}>Selected: {selectedColor}</Text>
        </View>
      </View>

      {/* ── BUSINESS LOGO / STAMP ICON ── */}
      <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18, marginTop: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#222" }}>
          Business Logo / Stamp Icon
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {stampIcons.map((icon) => (
            <TouchableOpacity
              key={icon}
              onPress={() => setSelectedIcon(icon)}
              style={{
                width: 50, height: 50, borderRadius: 12,
                backgroundColor: selectedIcon === icon ? "#EEF3FF" : "#F7F8FB",
                justifyContent: "center", alignItems: "center",
                marginRight: 10, marginBottom: 10,
                borderWidth: selectedIcon === icon ? 2 : 0,
                borderColor: "#2563EB",
              }}
            >
              <Text style={{ fontSize: 22 }}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Upload Logo */}
        <TouchableOpacity
          onPress={handleUploadLogo}
          style={{
            borderWidth: 1, borderStyle: "dashed", borderColor: "#D1D5DB",
            borderRadius: 15, padding: 20, marginTop: 10, alignItems: "center",
          }}
        >
          <Feather name="upload" size={22} color="#2563EB" />
          <Text style={{ marginTop: 5, color: "#666" }}>Upload Business Logo</Text>
          <Text style={{ fontSize: 12, color: "#999", marginTop: 3 }}>PNG or SVG, max 2MB</Text>
        </TouchableOpacity>
      </View>

      {/* ── SPEND SETUP ── */}
      <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18, marginTop: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>Spend Setup</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "48%" }}>
            <Text style={{ color: "#666", marginBottom: 5 }}>Points Per Rs</Text>
            <TextInput
              defaultValue="1"
              keyboardType="numeric"
              style={{ backgroundColor: "#F4F5FA", borderRadius: 12, padding: 14 }}
            />
          </View>
          <View style={{ width: "48%" }}>
            <Text style={{ color: "#666", marginBottom: 5 }}>Min Spend</Text>
            <TextInput
              defaultValue="Rs.100"
              keyboardType="numeric"
              style={{ backgroundColor: "#F4F5FA", borderRadius: 12, padding: 14 }}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
          <View style={{ width: "48%" }}>
            <Text style={{ color: "#666", marginBottom: 5 }}>Reward Threshold</Text>
            <TextInput
              defaultValue="500 pts"
              style={{ backgroundColor: "#F4F5FA", borderRadius: 12, padding: 14 }}
            />
          </View>
          <View style={{ width: "48%" }}>
            <Text style={{ color: "#666", marginBottom: 5 }}>Expiry Days</Text>
            <TextInput
              defaultValue="365"
              keyboardType="numeric"
              style={{ backgroundColor: "#F4F5FA", borderRadius: 12, padding: 14 }}
            />
          </View>
        </View>
      </View>

      {/* ── REDEMPTION RULES ── */}
     {/* ── REDEMPTION RULES ── */}
<View
  style={{
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginTop: 15,
  }}
>
  <Text
    style={{
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
    }}
  >
    Redemption Rules
  </Text>

  {redemptionOptions.map((r) => (
    <TouchableOpacity
      key={r.label}
      onPress={() => setSelectedRedemption(r.label)}
      style={{
        backgroundColor:
          selectedRedemption === r.label ? "#EEF3FF" : "#F7F8FB",
        borderWidth: selectedRedemption === r.label ? 2 : 0,
        borderColor: "#2563EB",
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Feather
          name={r.icon}
          size={22}
          color={
            selectedRedemption === r.label ? "#2563EB" : "#666"
          }
        />

        <View style={{ marginLeft: 12 }}>
          <Text
            style={{
              fontWeight: "bold",
              color:
                selectedRedemption === r.label
                  ? "#2563EB"
                  : "#222",
            }}
          >
            {r.label}
          </Text>

          <Text
            style={{
              color: "#666",
              fontSize: 12,
              marginTop: 3,
            }}
          >
            {r.sub}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ))}
</View>

      {/* ── BONUS MILESTONE ── */}
      <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18, marginTop: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Bonus Milestone</Text>
        <TextInput
          defaultValue="1000 Points = Free Coffee"
          style={{ backgroundColor: "#F4F5FA", borderRadius: 12, padding: 14 }}
        />
      </View>

      {/* ── AI SUGGESTION ──
      <View style={{
        backgroundColor: "#EEF6FF", borderRadius: 20, padding: 18,
        marginTop: 15, borderWidth: 1, borderColor: "#BFDBFE",
      }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="cpu" size={20} color="#2563EB" />
          <Text style={{ marginLeft: 8, color: "#2563EB", fontWeight: "bold", fontSize: 16 }}>
            AI Suggestion
          </Text>
        </View>
        <Text style={{ marginTop: 10, color: "#444", lineHeight: 22 }}>
          Earn 1 point per Rs spent. Redeem 500 points for a free item.
        </Text>
      </View> */}

    </>
  );
};

export default AmountCard;