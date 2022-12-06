import React, { useState } from "react";
import { Autocomplete, Stack, TextField} from "@mui/material";


export default function Form() {
    const [questions, setQuestions] = useState([0]);

    const handleNewInput = (event: any) => {
        console.log(event);
        // handle api call to elastic search
    }

    return (
        <Stack spacing={3}> 
            <Autocomplete
                options={questions}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Question"
                        placeholder="Enter a question"
                        onChange={handleNewInput}
                    />
                )}
            />
            <TextField
                variant="standard"
                multiline
                label="Answer"
                placeholder="Enter in your found answer"
                onChange={handleNewInput}
            />
        </Stack>
    )
}