import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import Editor from '@monaco-editor/react';
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const CodeEditor = () => {
  const [selectedQuestion,setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language,setLanguage] = useState<'javascript'|'python'|'java'>(LANGUAGES[0].id );
  const [code,setCode] = useState(selectedQuestion.starterCode[language]);

  const handleQuestionChange = (questionId:string) =>{
    const question = CODING_QUESTIONS.find((question) => question.id === questionId);
    if(!question) return null;
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);
  }

  const handleLanguageChange = (languageId:typeof LANGUAGES[number]['id']) =>{
    const language = LANGUAGES.find((language) => language.id === languageId);
    if(!language) return null;
    setLanguage(language.id);
    setCode(selectedQuestion.starterCode[language.id]);
  }

  return (
   <ResizablePanelGroup direction="vertical" className="h-[calc(100vh-4rem-1px)]">
      {/* Question Section */}
      <ResizablePanel defaultSize={30} minSize={25} maxSize={100}>
       <ScrollArea className="h-full" >
        <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6 flex flex-col">
             {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight">{selectedQuestion.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground">Choose your language and solve the problem</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Select Question */}
                <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder='Select Question'/>
                  </SelectTrigger>
                  <SelectContent>
                    {CODING_QUESTIONS.map((question) => (<SelectItem key={question.id} value={question.id}>{question.title}</SelectItem>))}
                  </SelectContent>
                </Select>


                {/* Select Language */}
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue> <div className="flex items-center gap-2">
                        <img src={`/${language}.png`} alt={language} className="size-5 object-contain" />
                        {LANGUAGES.find((l) => l.id === language)?.name}
                      </div>
                      </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((language) => (<SelectItem key={language.id} value={language.id}>
                      <div className="flex items-center gap-2">
                        <img src={`/${language.id}.png`} alt={language.name} className="size-5 object-contain" />
                        {language.name}
                      </div>
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Problem DESCRIPTION */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                      <BookIcon className="size-5 text-primary"/>
                      <CardTitle>Problem Description</CardTitle>
              </CardHeader>

              <CardContent className="text-sm leading-relaxed">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="whitespace-pre-line">{selectedQuestion.description}</p>
                      </div>
              </CardContent>
            </Card>

            {/* Problem Examples */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <LightbulbIcon className="size-5 text-yellow-500"/>
                <CardTitle>Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full w-full rounded-md border">
                  <div className="p-4 space-y-4">
                    {selectedQuestion.examples.map((example,index) => (<div key={index} className="space-y-2">
                      <p className="font-medium text-sm">Example {index + 1}:</p>
                      <ScrollArea className="h-full w-full rounded-md">
                        <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
                        <div>Input: {example.input}</div>
                        <div>Output: {example.output}</div>
                        {example.explanation && <div className="pt-2 text-muted-foreground">Explanation: {example.explanation}</div>}
                        </pre>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Constraints */}
            {selectedQuestion.constraints && (
              <Card>
                <CardHeader className="flex flex-row item-center gap-2">
                  <AlertCircleIcon className="size-5 text-blue-500"/>
                  <CardTitle>Constraints</CardTitle>
                </CardHeader>

                <CardContent>
                  <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                    {selectedQuestion.constraints.map((constraint,index) => (<li key={index} className="text-muted-foreground">{constraint}</li>))}
                  </ul>
                </CardContent>
              </Card>
            )}
        </div>
        </div>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle={true}/>
     {/* Code editor */}
    <ResizablePanel defaultSize={60} maxSize={100} className="flex flex-col ">
      <div className="flex-1 w-full h-full">
        <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        theme="vs-dark"
        onChange={(value) => setCode(value || '')}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 18,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding:{top:32,bottom:16},
          wordWrap:'on',
          wrappingIndent:'indent'
        }}
        />
      </div>
       </ResizablePanel>
   
   </ResizablePanelGroup>
  )
}

export default CodeEditor
