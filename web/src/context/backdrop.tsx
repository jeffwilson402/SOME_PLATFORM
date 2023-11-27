/* eslint-disable */
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useContext, ReactNode } from "react";
import { useState } from "react";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

interface IBackDropContext {
  fetching:(value: boolean) => void;
}
const BackdropContext = React.createContext<IBackDropContext | null>(null);
// let fetching;
const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    zIndex: 10000,
    color: "#fff",
  },
}));

interface BackDropProps {
  children: ReactNode;
}
export function useBackdrop() {
  return useContext(BackdropContext);
}

export default function BackdropProvider({ children }: BackDropProps) {
  const [backdrop, setBackdrop] = useState(false);
  const classes = useStyles();

  const fetching = (value: boolean) => {
    setBackdrop(value);
  };

  return (
    <BackdropContext.Provider value={{fetching}}>
      <Backdrop className={classes.backdrop} open={backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </BackdropContext.Provider>
  );
}
