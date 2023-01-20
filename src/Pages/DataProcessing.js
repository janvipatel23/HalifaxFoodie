import React, {useState} from "react";
import AWS from "aws-sdk";
import awsKeys from "../Keys/awsCred1";
import {Grid} from "@mui/material";
import Button from "@mui/material/Button";
import {Typography} from "@mui/material";
import {useContext} from "react";
import ButtonAppBar from "../Components/NavBar";
import {Box} from "@mui/system";
import {UserContext} from "../App";

/**
 * Author: Meghdoot Ojha
 * Code to upload recipes in the S3 and trigger lambda in AWS
 */

window.Buffer = window.Buffer || require("buffer").Buffer;
const S3_BUCKET = "recipeupload";

//fetch aws keys
AWS.config.update({
    accessKeyId: awsKeys.accessKeyId,
    secretAccessKey: awsKeys.secretAccessKey,
    sessionToken: awsKeys.sessionToken,
});

const myBucket = new AWS.S3({
    params: {Bucket: S3_BUCKET},
    region: awsKeys.region,
});

const UploadImageToS3WithNativeSdk = () => {
    const {user} = useContext(UserContext);
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const uploadFile = (file) => {
        if (!file) {
            alert("Please select a file");
            return;
        }
        const params = {
            ACL: "public-read",
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name,
        };

        //uploading object to S3
        myBucket
            .putObject(params)
            .on("httpUploadProgress", (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100));
                if (progress == 100) alert("Upload complete");
                console.log(progress, evt);
            })
            .send((err) => {
                if (err) console.log(err);
            });
    };

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
                    <br/>
                    <br/>
                    Upload Recipe
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
                        File Upload: {progress}%
                    </Typography>
                    <form>
                        <Button variant="contained" component="label">
                            Choose File
                            <input type="file" onChange={handleFileInput} hidden/>
                        </Button>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => uploadFile(selectedFile)}
                            sx={{mt: 1}}
                        >
                            Upload to S3
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UploadImageToS3WithNativeSdk;
