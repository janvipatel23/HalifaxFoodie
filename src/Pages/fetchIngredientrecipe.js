import {fetchData} from "./ShowIngredient";
import React, {useContext, useEffect, useState} from "react";
import {Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ButtonAppBar from "../Components/NavBar";
import {Box} from "@mui/system";
import {UserContext} from "../App";

/**
 * Author: Meghdoot Ojha
 * Fetch ingredients from DynamoDB based on particular recipe
 */

function Fetch() {
    const {user} = useContext(UserContext);
    const [ingredient, setIngredient] = useState("");
    const [data, setData] = useState(null);
    const [table, setTable] = useState([]);

    function getdata(err, temp) {
        let p = temp.Items.find((x) => x.RecipeName == ingredient);
        console.log(p);
        setData(p);
        console.log(data);
    }

    function getTable(err, temp) {
        let name = temp.Items.map((x) => x.RecipeName);
        setTable(name);
        console.log(table);
    }

    async function workFetch(e) {
        console.log(ingredient, table);
        fetchData(ingredient, getdata);
    }

    useEffect(() => {
        fetchData(null, getTable);
    }, []);
    return (
        <Box
            sx={{
                minHeight: 1000,
                color: "text.secondary",
            }}
        >
            <ButtonAppBar/>
            <Grid container direction="column" alignItems="center" sx={{pt: 3}}>
                <Typography
                    variant="h5"
                    gutterBottom
                    noWrap
                    textAlign="center"
                    sx={{
                        fontFamily: "monospace",
                        fontWeight: 900,
                        letterSpacing: ".3rem",
                        textDecoration: "none",
                        fontSize: 30,
                        textAlign: "center",
                    }}
                >
                    Hi {user?.attributes.email},
                </Typography>
            </Grid>
            <Grid container direction="column" alignItems="center" sx={{pt: 2}}>
                <Grid width="500px" sx={{border: 1, p: 3}}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        noWrap
                        textAlign="center"
                        sx={{
                            fontFamily: "monospace",
                            fontWeight: 900,
                            letterSpacing: ".3rem",
                            textDecoration: "none",
                            fontSize: 30,
                            textAlign: "center",
                        }}
                    >
                        Fetch Recipes
                    </Typography>
                    <form>
                        <InputLabel id="demo-simple-select-label">Receipes</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            fullWidth
                            value={ingredient}
                            label="restaurant"
                            onChange={(e) => setIngredient(e.target.value)}
                        >
                            {Array.isArray(table)
                                ? table.map((item) => (
                                    <MenuItem value={item} key={item}>
                                        {item}
                                    </MenuItem>
                                ))
                                : null}
                        </Select>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => workFetch()}
                            sx={{mt: 1}}
                        >
                            Fetch
                        </Button>
                    </form>
                </Grid>
                <div>
                    {data && data.RecipeName ? (
                        <div>
                            <h3>Recipe Name is: {data.RecipeName} </h3>
                            <h3>Ingredients are: {data.Ingredients}</h3>
                        </div>
                    ) : null}
                </div>
            </Grid>
        </Box>
    );
}

export default Fetch;
