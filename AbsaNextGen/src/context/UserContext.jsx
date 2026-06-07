import { createContext, useContext, useState, useEffect } from "react";
import { currentUser } from "../data/userData";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("userData");
      if (saved) return JSON.parse(saved);

      const currentEmail = localStorage.getItem("currentUser");
      if (currentEmail) {
        const accountData = localStorage.getItem(currentEmail);
        if (accountData) {
          const parsed = JSON.parse(accountData);
          const initials = parsed.name
            ? parsed.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : currentUser.initials;
          return {
            ...currentUser,
            name: parsed.name || currentUser.name,
            email: currentEmail,
            initials,
          };
        }
      }
    } catch (err) {
      console.warn("Could not read from localStorage:", err);
    }
    return currentUser;
  });

  useEffect(() => {
    try {
      localStorage.setItem("userData", JSON.stringify(user));
    } catch (err) {
      console.warn("Could not save to localStorage:", err);
    }
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

  const updateCategory = (id, amount) => {
    setUser((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === id ? { ...c, amount } : c
      ),
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
        updateCategory,
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
