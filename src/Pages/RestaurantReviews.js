import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import ButtonAppBar from "../Components/NavBar";
import { useState, useEffect, useContext } from "react";
import * as AWS from "aws-sdk";
import awsKeys from "../Keys/awsCred";
import { UserContext } from "../App";

AWS.config.update({
  region: awsKeys.region,
  accessKeyId: awsKeys.accessKeyId,
  secretAccessKey: awsKeys.secretAccessKey,
  sessionToken: awsKeys.sessionToken,
});
const docClient = new AWS.DynamoDB.DocumentClient();

export default function RestReviews() {
  const { user } = useContext(UserContext);
  const [restaurantList, setRestaurantList] = useState([]);

  function createData(name, calories, fat) {
    return { name, calories, fat };
  }

  useEffect(() => {
    var params = {
      TableName: "orderTable2",
    };

    docClient.scan(params, function (err, data) {
      if (!err) {
        console.log(data.Items);
        let pp = data.Items.filter((x) => x.rest_id == user?.attributes.email);
        let p = pp.filter((x) => x.rating != null);
        console.log("p", p);
        setRestaurantList(p);
      }
    });
  }, []);

  const rowss = [
    restaurantList.map((p) => createData(p.user_id, p.order_item, p.rating)),
  ];

  return (
    /**
     * Author: Sangramsinh More
     * Page for Restaurant Reviews
     */
    <Box
      sx={{
        minHeight: 1000,
        color: "text.secondary",
      }}
    >
      <ButtonAppBar />
      <Box sx={{ maxWidth: 700, pl: 40, pt: 5 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>User Id</TableCell>
                <TableCell align="right">Food Item</TableCell>
                <TableCell align="right">Review</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowss[0].map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
