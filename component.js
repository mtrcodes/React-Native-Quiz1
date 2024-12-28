import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const TaskListScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      setErrorMessage("Unable to load tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterTasks = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) =>
        task.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  };

  const toggleSelection = (id) => {
    setSelectedTask(id);
  };

  if (isLoading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Task Manager</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Search tasks..."
        placeholderTextColor="#888"
        value={searchTerm}
        onChangeText={filterTasks}
      />
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleSelection(item.id)}
            style={[
              styles.taskItem,
              selectedTask === item.id && styles.selectedTask,
            ]}
          >
            <Text style={styles.taskText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
  inputField: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderColor: "#DDDDDD",
    color: "#333333",
    fontSize: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#007BFF",
  },
  taskItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedTask: {
    backgroundColor: "#E0F7FA",
  },
  taskText: {
    fontSize: 16,
    color: "#333333",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007BFF",
  },
  errorMessage: {
    color: "#FF6F61",
    fontSize: 18,
    textAlign: "center",
  },
});

export default TaskListScreen;
