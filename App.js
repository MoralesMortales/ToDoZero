import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TextInput, FlatList, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [enteredGoalText, setEnteredGoalText] = useState("");
  const [allGoals, setAllGoals] = useState([]);

  // Cargar las tareas al iniciar la app
  useEffect(() => {
    loadGoals();
  }, []);

  // Guardar las tareas cada vez que cambian
  useEffect(() => {
    saveGoals();
  }, [allGoals]);

  const loadGoals = async () => {
    try {
      const savedGoals = await AsyncStorage.getItem("@goals");
      if (savedGoals !== null) {
        setAllGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.error("Error al cargar las tareas:", error);
    }
  };

  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem("@goals", JSON.stringify(allGoals));
    } catch (error) {
      console.error("Error al guardar las tareas:", error);
    }
  };

  function goalInputHandler(enteredText) {
    setEnteredGoalText(enteredText);
  }

  function addGoalHandler() {
    if (enteredGoalText.trim() === "") return; // No agregar tareas vacías
    
    setAllGoals((currentGoals) => [
      ...currentGoals,
      { text: enteredGoalText, id: Math.random().toString() },
    ]);
    setEnteredGoalText(""); // Limpiar el input después de agregar
  }

  function deleteGoalHandler(id) {
    setAllGoals(currentGoals => {
      return currentGoals.filter((goal) => goal.id !== id);
    });
  }

  return (
    <View style={styles.appContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Coloca una nueva tarea"
          onChangeText={goalInputHandler}
          value={enteredGoalText}
        />
        <Button title="Nueva Tarea" onPress={addGoalHandler} />
      </View>
      <View style={styles.goalsContainer}>
        <Text style={styles.titleList}>Tu Lista de Tareas</Text>
        <FlatList
          data={allGoals}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => deleteGoalHandler(item.id)}
              style={({ pressed }) => pressed && styles.pressedItem}
            >
              <View style={styles.goal}>
                <Text>{item.text}</Text>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    padding: 20,
    paddingTop: 50,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 24,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  titleList: {
    marginHorizontal: "auto",
    marginBottom: 20,
  },
  goal: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 25,
    paddingLeft: 25,
    backgroundColor: "rgba(2,2,2,.05)",
    borderRadius: 9
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "60%",
    marginRight: 10,
    padding: 12,
  },
  goalsContainer: {
    flex: 8,
  },
});
