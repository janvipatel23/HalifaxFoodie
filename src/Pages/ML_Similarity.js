import AWS from "aws-sdk";
import awsKeys from "../Keys/awsCred1";
import {fetchData} from "./ShowSimilarRecipies";
import React, {useContext, useEffect, useState} from "react";
import {Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {UserContext} from "../App";

/**
 * Author: Meghdoot Ojha
 * Feature to find similarity in the recipes
 */

AWS.config.update({
    accessKeyId: awsKeys.accessKeyId,
    secretAccessKey: awsKeys.secretAccessKey,
    sessionToken: awsKeys.sessionToken,
});

const myBucket = new AWS.S3({
    params: {Bucket: "recipeupload"},
    region: awsKeys.region,
});

function calculateSimilarity() {
    const {user} = useContext(UserContext);
    const [ingredient] = useState("");
    const [data, setData] = useState(null);
    const [table, setTable] = useState([]);

    function getdata(err, temp) {
        let p = temp.Items.find((x) => x.Recipe_Name == ingredient);
        console.log(p);
        setData(p);
        console.log(data);
    }

    function getTable(err, temp) {
        let name = temp.Items.map((x) => x.Recipe_Name);
        setTable(name);
        console.log(table);
    }

    async function workFetch(e) {
        console.log("ingredient and table", ingredient, table);
        fetchData(ingredient, getdata);
    }

    useEffect(() => {
        fetchData(null, getTable);
    }, []);

    const [setRecipes] = useState("");
    const [setRecipe] = useState("");
    const [loadedData, setLoadedData] = useState([]);
    const [setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function getReceipe() {
            const {Contents} = await myBucket.listObjects({Bucket: 'recipeupload'}).promise();
            console.log(Contents);
            let newList = [];
            for (const obj of Contents) {
                newList = newList.concat(obj.Key);
            }
            console.log(newList);
            setLoadedData(newList);
        }

        getReceipe();
    }, [])

    //button calling function
    async function openDialog(file) {
        console.log("file ", file);
        setRecipe(file);
        var ingredient = [];
        var alterString = '';
        console.log("keysarray: ", loadedData)
        for (const i of loadedData) {
            await axios.post("https://r3cqhwf4o34bvtiwmn5nygopx40slbpi.lambda-url.us-east-1.on.aws/", {"file": i}).then((response) => {
                // if(file == i) {
                console.log("res ", response);
                alterString = response.data;
                ingredient.push(response.data)
                console.log("f ", alterString);
            })
        }
        console.log("ingre ", ingredient, ingredient.map(x => x.split(",")));
        let a = ingredient.map(x => x.split(","));
        let checkArray = [];
        for (let i = 0; i < a.length; i++) {
            console.log(a[i])
            for (let j = 0; j < a[i].length; j++) {
                console.log(a[i][j])
                checkArray[j] = (checkArray[j] ? checkArray[j] + '*' : '') + '' + a[i][j]
            }
        }
        console.log("checkarray: ", checkArray.join("\n").replaceAll("*", ","))
        let removeStar = "Ingredient1,Ingredient2" + "\n" + checkArray.join("\n").replaceAll("*", ",")
        console.log("finalRecipe:" + removeStar)
        //Reference 4
        await axios.post("https://us-central1-group11-369414.cloudfunctions.net/MLSimilarityCSV", {"data": removeStar}
        ).then((response) => {
            console.log(response);
            setRecipes(response.data);
        })
        setOpen(true);
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" onClick={() => navigate("/admin")}>Return</Button>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        HalifaxFoodie
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid item style={{padding: "10%"}} width="xs">
                <Paper elevation={10} style={{
                    backdropFilter: "blur(50px)",
                    background: "rgba(0,0,0,0)",
                    WebkitBackdropFilter: "blur(50px)"
                }}>
                    <br/>
                    <br/>
                    <FormControl fullWidth>
                        {/*https://mui.com/material-ui/react-select/*/}
                        <InputLabel id="demo-simple-select-label">Receipes</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={loadedData}
                            label="Receipes"
                            onChange={event => openDialog(event.target.value)}>
                            {
                                Array.isArray(loadedData) ?
                                    loadedData.map((item) => (
                                        <MenuItem value={item}>{item}</MenuItem>
                                    )) : null}
                        </Select>
                    </FormControl>
                </Paper>
            </Grid>
        </div>
    );}

    export default calculateSimilarity;

