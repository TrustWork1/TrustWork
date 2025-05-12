import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PackagesContent from "./contents";
import AddPackagesList from "./list";

// Styled components for better UI
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  marginRight: theme.spacing(4),
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  "&.Mui-focusVisible": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const TabPanel = (props: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
      style={{ padding: "20px 0" }}
    >
      {value === index && children}
    </div>
  );
};

const PackagesSection = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography
          variant='h2'
          gutterBottom
          sx={{
            m: 2,
            fontWeight: 600
          }}
        >
          Packages Section
        </Typography>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="order management tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <StyledTab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1">Content</Typography>
              </Box>
            }
          />
          <StyledTab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1">Packages List</Typography>
              </Box>
            }
          />
        </StyledTabs>
      </Box>

      <Box sx={{ p: 2 }}>
        <TabPanel value={activeTab} index={0}>
          <PackagesContent />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: 1 }}>
            <AddPackagesList />
          </Box>
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default PackagesSection;
