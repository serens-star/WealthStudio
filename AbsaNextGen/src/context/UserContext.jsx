import { createContext, useContext, useState, useEffect } from "react";
import { currentUser } from "../data/userData";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : currentUser;
  });

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(user));
  }, [user]);

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const updateSpending = (updates) => {
    setUser((prev) => ({
      ...prev,
      spending: { ...prev.spending, ...updates },
    }));
  };

  const updateSaContext = (updates) => {
    setUser((prev) => ({
      ...prev,
      saContext: { ...prev.saContext, ...updates },
    }));
  };

  const updateGoal = (id, updates) => {
    setUser((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  };

  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now(),
    };
    setUser((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  };

  const removeGoal = (id) => {
    setUser((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  };

  const updateNudge = (id, updates) => {
    setUser((prev) => ({
      ...prev,
      nudges: prev.nudges.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
  };

  const addNudge = (nudge) => {
    setUser((prev) => ({
      ...prev,
      nudges: [...prev.nudges, { ...nudge, id: Date.now() }],
    }));
  };

  const removeNudge = (id) => {
    setUser((prev) => ({
      ...prev,
      nudges: prev.nudges.filter((n) => n.id !== id),
    }));
  };

  const resetUser = () => {
    localStorage.removeItem("userData");
    setUser(currentUser);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        updateSpending,
        updateSaContext,
        updateGoal,
        addGoal,
        removeGoal,
        updateNudge,
        addNudge,
        removeNudge,
        resetUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
}
