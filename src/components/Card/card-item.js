import { CardContent, Divider, Stack, Typography } from "@mui/material";

export const CardItem = (props) => {
  const { name, content, lastItem } = props;
  return (
    <>
      <CardContent sx={{ py: 1 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">{name}</Typography>
          <Typography variant="body2">{content || "--"}</Typography>
        </Stack>
      </CardContent>
      {!lastItem && <Divider />}
    </>
  );
};
