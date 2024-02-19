import React, { useState, useEffect } from "react";
import "./Product.css";

function Product() {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState("");
  const [newReps, setNewReps] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const storedWorkouts = JSON.parse(localStorage.getItem("workouts")) || [];
    setWorkouts(storedWorkouts);
  }, []);

  const saveWorkoutsToLocalStorage = (workouts) => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  };

  const addNewWorkout = () => {
    if (newWorkout && newReps && newWeight) {
      const newWorkoutEntry = {
        id: Date.now(),
        name: newWorkout,
        reps: parseInt(newReps, 10),
        weight: parseFloat(newWeight),
      };

      setWorkouts([...workouts, newWorkoutEntry]);
      saveWorkoutsToLocalStorage([...workouts, newWorkoutEntry]);

      setNewWorkout("");
      setNewReps("");
      setNewWeight("");
    }
  };

  const deleteWorkout = (id) => {
    const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
    setWorkouts(updatedWorkouts);
    saveWorkoutsToLocalStorage(updatedWorkouts);
  };

  const calculateOneRepMax = (weight, reps) => {
    // Use Epley Formula for One Rep Max calculation
    return Math.round(weight * (1 + 0.0333 * reps));
  };

  const renderWorkouts = workouts
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((workout) => (
      <li key={workout.id}>
        <span>{workout.name}</span>
        <span>Reps: {workout.reps}</span>
        <span>Weight: {workout.weight} lbs</span>
        <span>
          1RM: {calculateOneRepMax(workout.weight, workout.reps)} lbs
        </span>
        <button onClick={() => deleteWorkout(workout.id)}>Delete</button>
      </li>
    ));

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="topDashboard">

      {/* Add Workout Form */}
      <div className="workoutForm">
        <h2>Add New Workout</h2>
        <form>
          <label>
            Workout Name:
            <input
              type="text"
              value={newWorkout}
              onChange={(e) => setNewWorkout(e.target.value)}
            />
          </label>
          <label>
            Number of Reps:
            <input
              type="number"
              value={newReps}
              onChange={(e) => setNewReps(e.target.value)}
            />
          </label>
          <label>
            Weight (lbs):
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
            />
          </label>
          <button type="button" onClick={addNewWorkout}>
            Add Workout
          </button>
        </form>
      </div>

      {/* Workout List */}
      <div className="workoutList">
        <h2>Workout History</h2>
        <ul>{renderWorkouts}</ul>

        {/* Pagination */}
        {workouts.length > itemsPerPage && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(workouts.length / itemsPerPage) }).map(
              (_, index) => (
                <div
                  key={index}
                  onClick={() => handlePagination(index + 1)}
                >
                  {index + 1}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;