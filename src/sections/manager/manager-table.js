import { getFullName } from "@/utils/string";
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { ArrowRight, Edit3 } from "react-feather";
import { Scrollbar } from "src/components/scrollbar";

export const MangerTable = (props) => {
  const { items = [] } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Updated at</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                const updatedAt = format(new Date(user.updated_at), "dd/MM/yyyy");

                return (
                  <TableRow hover key={user.id}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={user.avatar} />
                        <Typography variant="subtitle2">
                          {getFullName(user.first_name, user.last_name)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.is_active ? (
                        <Chip size="small" label="Active" color="success" variant="outlined" />
                      ) : (
                        <Chip size="small" label="Inactive" color="error" />
                      )}
                    </TableCell>
                    <TableCell>{updatedAt}</TableCell>
                    <TableCell>
                      <Stack direction="row" gap={1}>
                        <ButtonBase
                          title={`Detail`}
                          sx={{
                            color: "rgb(108, 115, 127)",
                            p: 1,
                            ":hover": {
                              background: "rgba(108, 115, 127, 0.04)",
                              borderRadius: 8,
                            },
                          }}
                          href={`/managers/${user.id}`}
                          component={NextLink}
                        >
                          <Edit3 size={22} />
                        </ButtonBase>
                        <ButtonBase
                          title={`Detail`}
                          sx={{
                            color: "rgb(108, 115, 127)",
                            p: 1,
                            ":hover": {
                              background: "rgba(108, 115, 127, 0.04)",
                              borderRadius: 8,
                            },
                          }}
                          href={`/managers/${user.id}`}
                          component={NextLink}
                        >
                          <ArrowRight />
                        </ButtonBase>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

MangerTable.propTypes = {
  items: PropTypes.array,
};
