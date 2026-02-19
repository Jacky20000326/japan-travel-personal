import { useState } from "react";
import { useAtomValue } from "jotai";
import Box from "@mui/material/Box";
import Header from "./components/common/Header/Header";
import { MainTabs } from "./components/common/MainTabs/MainTabs";

import LoadingScreen from "./components/common/LoadingScreen/LoadingScreen";
import { selectedMainTabAtom } from "./atoms/navigationAtoms";

import ExpensesPage from "./components/ExpensesPage/ExpensesPage";
import { SchedulePage } from "./components/SchedulePage/SchedulePage";

const App = () => {
  const [fakeExperienceLoading, setFakeExperienceLoading] = useState(true);
  const selectedMainTab = useAtomValue(selectedMainTabAtom);

  if (fakeExperienceLoading) {
    return (
      <LoadingScreen
        visible={fakeExperienceLoading}
        onComplete={() => setFakeExperienceLoading(false)}
      />
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        "&::before":
          selectedMainTab === "schedule"
            ? {
                content: '""',
                position: "fixed",
                inset: 0,
                zIndex: -1,
                backgroundImage: "url('/images/snoopy-crown.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "960px 100vh",
                backgroundPosition: "center",
              }
            : {},
      }}
    >
      <Header />
      <MainTabs />
      {selectedMainTab === "schedule" ? <SchedulePage /> : <ExpensesPage />}
    </Box>
  );
};

export default App;
