import React, { useState } from "react";
import axios from 'axios';
import { Autocomplete, Button, Stack, TextField, Paper} from "@mui/material";


export default function Form() {
    const [questionAnswers, setQuestionAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [answerLabel, setAnswerLabel] = useState("Answer");
    
    const BASE_URL = "http://localhost:8080";

    
    const handleNewInput = async (event: any) => {
        setCurrentQuestion(event.target.value);
        try {
            const response = await axios({
                method: "get",
                headers: { 
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                },
                url: `${BASE_URL}/question?search=${event.target.value}`,
            });
            const result = response.data;
            setQuestionAnswers(result);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSelect = async (event: any) => {
        setAnswerLabel("");
        try {
            const response = await axios({
                method: "get",
                headers: { 
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                },
                url: `${BASE_URL}/question?search=${event.target.outerText}`,
            });
            const result = response.data;
            setQuestionAnswers(result);
            setCurrentQuestion(result[0]._source.question);
            setCurrentAnswer(result[0]._source.answer);
        } catch (error) {
            console.error(error);
        } 
        
    }

    const handleSubmit = async () => {
        console.log(questionAnswers);
        const first: any = questionAnswers[0];
        if (first == undefined || currentQuestion != first._source.question) {
            try {
                await axios({
                    method: "post",
                    url: `${BASE_URL}/question`,
                    data: {
                        question: currentQuestion,
                        answer: currentAnswer
                    },
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const currentQA: any = questionAnswers[0];
                await axios({
                    method: "patch",
                    url: `${BASE_URL}/question?id=${currentQA._id}`,
                    data: {
                        question: currentQuestion,
                        answer: currentAnswer
                    },
                });
            } catch (error) {
                console.error(error);
            }
        }
        window.close();
    }

    const handleAnswer = (event: any) => {
        setCurrentAnswer(event.target.value);
        setAnswerLabel("Answer")
    }

    return (
        <Paper sx= {
            {
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                    m: '25px',
                    width: 300,
                },
            }
        } elevation={3}>
            <Stack spacing={3}> 
                <Autocomplete
                    freeSolo
                    options={(questionAnswers.map((ans: any) => ans._source.question))}
                    onChange={handleSelect}
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
                    label={answerLabel}
                    placeholder="Enter in your found answer"
                    onChange={handleAnswer}
                    defaultValue={currentAnswer}
                />
                <Button onClick={handleSubmit} variant="contained">Submit</Button>
            </Stack>
        </Paper>
        
    )
}