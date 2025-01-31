import { Text, View, StyleSheet } from "react-native";

export default function BioView({
  loading,
  data,
}: {
  loading: boolean;
  data?:
    | null
    | undefined
    | { Bio: string; Interest?: string; interest?: string };
}) {
  if (loading) {
    <Text>Loading</Text>;
  }

  if (data) {
    return (
      <View style={styles.bioView}>
        {data && (
          <View style={styles.bioViewInnerContent}>
            <Text style={styles.bioText}>Bio: {data?.Bio}</Text>
            <Text style={styles.bioText}>
              I'm {data?.Interest ?? data?.interest}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  bioView: {
    width: "60%",
    height: "auto",
    marginBottom: 30,
  },
  bioViewInnerContent: {
    padding: 20,
    alignSelf: "center",
  },
  bioText: {
    width: "100%",
    marginBottom: 10,
  },
});
