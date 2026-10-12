import React, { createContext, useContext, useState } from "react";

interface InsightsContextProps {
    month: Date
    setMonth: (month: Date) => void
}

const InsightsContext = createContext<InsightsContextProps | null>(null)

function InsightsProvider({ children }: { children: React.ReactNode }) {
    const [month, setMonth] = useState<Date>(new Date())

    return <InsightsContext.Provider value={{ month, setMonth }}>
        {children}
    </InsightsContext.Provider>
}

const useInsightsContext = () => {
    const context = useContext(InsightsContext)
    if (!context) throw new Error('Context not found!')
    return context
}
export { InsightsContext, InsightsProvider, useInsightsContext };
