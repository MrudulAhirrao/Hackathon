import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react"
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type McqData, type Question } from '@/types/mcq.type';
import { Textarea } from '@/components/ui/textarea';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { useState } from 'react';
import apiCall from "@/lib/apicall"
import constant from "@/constant/contstant.json"
import { toast } from "sonner"

interface McqDataProps {
    // Define your props here, for example:
    mcqData?: McqData;
}

interface QuestionProps {
    question: Question;
}

export default function McqComponent({ mcqData: initialMcqData }: McqDataProps) {
    if (!initialMcqData)
        return (<></>);
    const [mcqData, setMcqData] = useState<McqData>(initialMcqData!);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleQuestionChange = (index: number, newText: string) => {
        const updatedQuestions = mcqData.questions.map((q, i) =>
            i === index ? { ...q, question: newText } : q
        );
        setMcqData({ ...mcqData, questions: updatedQuestions });
    };

    const handleAnswerChange = (index: number, newAnswer: string) => {
        const updatedQuestions = mcqData.questions.map((q, i) =>
            i === index ? { ...q, answer: newAnswer } : q
        );
        setMcqData({ ...mcqData, questions: updatedQuestions });
    };

    const saveMcqData = async () => {
        setIsLoading(true);
        try {

            console.log("Mcq data:", mcqData);

            const response = await apiCall(`${constant.baseUrl}/api/v1/ai/saveMcqData`, "POST", mcqData);
            const data = await response.json();
            console.log("Response:", data);
            if (!response.ok) {
                toast.error("Failed to save MCQs. Please try again.");
                return;
            }
            toast.success("MCQs Saved successfully!");
            setMcqData(data);
        } catch (error) {
            // handle error (optional)
            toast.error("Error saving MCQs. Please try again.");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    MCQ Generated
                    <span className="flex items-center gap-1">
                        <BookmarkBorderOutlinedIcon
                            style={{
                                color:
                                    mcqData.questions[0].difficulty === 'easy'
                                        ? 'green'
                                        : mcqData.questions[0].difficulty === 'medium'
                                            ? 'orange'
                                            : 'red'
                            }}
                        />
                        <span>
                            {mcqData.questions[0].difficulty.charAt(0).toUpperCase() +
                                mcqData.questions[0].difficulty.slice(1)}
                        </span>
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {mcqData.questions.map((question, idx) => (
                    <McqQuestion
                        key={idx}
                        index={idx}
                        question={question}
                        onQuestionChange={(newText) => handleQuestionChange(idx, newText)}
                        onAnswerChange={(newAnswer) => handleAnswerChange(idx, newAnswer)}
                    />
                ))}

                <div className="flex justify-center mt-6">
                    <Button size="sm" disabled={isLoading} onClick={saveMcqData}>
                        {isLoading ? (
                            <>
                                <Loader2Icon className="animate-spin mr-2" />
                                Please wait
                            </>
                        ) : (
                            "Save MCQ"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function McqQuestion({
    index,
    question,
    onQuestionChange,
    onAnswerChange,
}: {
    index: number;
    question: Question;
    onQuestionChange: (newText: string) => void;
    onAnswerChange: (newAnswer: string) => void;
}) {
    return (
        <Card className="mt-5">
            <CardContent>
                <div className='flex items-center gap-2'>
                    <Badge variant="outline" className="h-8 w-7 flex items-center justify-center rounded">{++index}</Badge>
                    <Textarea
                        className="resize-none"
                        value={question.question}
                        onChange={(e) => onQuestionChange(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ml-9">
                    <div>
                        <RadioGroup
                            defaultValue={question.answer}
                            className='grid grid-cols-1 md:grid-cols-2 gap-4'
                            onValueChange={onAnswerChange}
                        >
                            {question.options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <RadioGroupItem value={opt} id={`r${i}`} />
                                    <Label htmlFor={`r${i}`}>{opt}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
