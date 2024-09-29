import { Box, CircularProgress, CircularProgressProps } from "@mui/material";

export const CircularProgressWithLabelAbsoluteSmall = (
    props: CircularProgressProps & { value: number },
  ) => {
    return (
      <Box sx={{ position: "fixed", top: '1rem', right: '1.5rem', zIndex: 2000  }}>
        <CircularProgress variant="determinate" {...props} size={40} color="success"/>
        <Box
          sx={{
            fontSize: '.6rem',
            top: -5,
            left: 3,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {`${Math.round(props.value)}%`}
        </Box>
      </Box>
    );
  }