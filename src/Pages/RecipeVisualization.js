import React, {useContext, useEffect, useState} from 'react';
import AWS from "aws-sdk";
import axios from "axios";
import awsKeys from "../Keys/awsCred1";
import {Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import ButtonAppBar from "../Components/NavBar";
import {Box} from "@mui/system";
import {UserContext} from "../App";

/**
 * Author: Meghdoot Ojha
 * Visualize Recipes using aloud function and Looker Studio
 */

AWS.config.update({
    accessKeyId: awsKeys.accessKeyId,
    secretAccessKey: awsKeys.secretAccessKey,
    sessionToken: awsKeys.sessionToken,
});

const myBucket = new AWS.S3({
    params: {Bucket: 'recipeupload'},
    region: awsKeys.region
})

//function to fetch data and pass to cloud function/
function RecipeVisualization() {
    const {user} = useContext(UserContext);
    const [setRecipes] = useState("");
    const [keys, setKeys] = useState([]);
    const [setOpen] = useState(false);

    useEffect(() => {
        async function getReceipe() {
            const {Contents} = await myBucket.listObjects({Bucket: 'recipeupload'}).promise();
            console.log(Contents);
            let newList = [];
            for (const obj of Contents) {
                newList = newList.concat(obj.Key);
            }
            console.log(newList);
            setKeys(newList);
        }

        getReceipe();
    }, [])

    async function openDialog() {
        var ingredient = [];
        var alterString = '';
        console.log("keys: ", keys)
        for (const i of keys) {
            await axios.post("https://r3cqhwf4o34bvtiwmn5nygopx40slbpi.lambda-url.us-east-1.on.aws/", {"file": i}).then((response) => {
                console.log("res ", response);
                alterString = response.data;
                ingredient.push(response.data)
                console.log("f ", alterString);
            })
        }
        console.log("ingredient ", ingredient, ingredient.map(x => x.split(",")));
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
        let removeStar = keys.map(x => x.replace(".txt", "")).join(",") + "\n" + checkArray.join("\n").replaceAll("*", ",")
        console.log("finalRecipe:" + removeStar)
        await axios.post("https://us-central1-group11-369414.cloudfunctions.net/visuaLizeRecipeCSV", {"data": removeStar}
        ).then((response) => {
            console.log(response);
            setRecipes(response.data);
        })
        setOpen(true);
        window.open("https://datastudio.google.com/embed/reporting/c785223d-6906-4f33-8929-37c19b5f2b5f/page/baM9C");
    }

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
                            fontSize: 25,
                            textAlign: "center",
                        }}
                    >
                        Visualize Recipes
                    </Typography>
                    <form>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={openDialog}
                            sx={{mt: 1}}
                        >
                            Visualize
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </Box>
    );
}

export default RecipeVisualization;
