import { Box, CircularProgress, CircularProgressProps } from "@mui/material";

export const CircularProgressWithLabel = (
    props: CircularProgressProps & { value: number },
  ) => {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} size={125}/>
        <Box
          sx={{
            top: 0,
            left: 7,
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