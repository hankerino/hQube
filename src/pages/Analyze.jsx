
import React, { useState, useCallback } from 'react';
import { UploadFile, InvokeLLM } from '@/api/integrations';
import { AnalysisRequest } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Upload, Loader2, BrainCircuit, ShieldCheck, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setAnalysisResult(null);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select a file to analyze.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    let fileUrl = '';
    try {
      const uploadResult = await UploadFile({ file });
      fileUrl = uploadResult.file_url;
      toast({ title: "File Uploaded", description: "Your file has been successfully uploaded.", className: "bg-green-100" });
    } catch (error) {
      setIsUploading(false);
      toast({ title: "Upload Failed", description: "There was an error uploading your file.", variant: "destructive" });
      return;
    }
    setIsUploading(false);

    setIsAnalyzing(true);
    setAnalysisResult(null);
    let newAnalysisRequest = null;
    try {
      newAnalysisRequest = await AnalysisRequest.create({
        file_name: file.name,
        file_url: fileUrl,
        status: 'pending',
      });

      const analysisPrompt = `Analyze the following document, which is a ${file.type}. Provide a concise summary of its content, identify key points, and highlight any potential security risks, compliance issues, or operational inefficiencies mentioned or implied. Format the output as a JSON object with three keys: "summary", "key_points" (an array of strings), and "risks" (an array of strings).`;
      
      const llmResult = await InvokeLLM({
        prompt: analysisPrompt,
        file_urls: [fileUrl],
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_points: { type: "array", items: { type: "string" } },
            risks: { type: "array", items: { type: "string" } },
          },
        },
      });

      if (llmResult) {
        setAnalysisResult(llmResult);
        await AnalysisRequest.update(newAnalysisRequest.id, {
          analysis_summary: JSON.stringify(llmResult, null, 2),
          status: 'completed'
        });
        toast({ title: "Analysis Complete", description: "Document analysis finished successfully.", className: "bg-green-500 text-white" });
      } else {
        throw new Error("LLM returned no result.");
      }
    } catch (error) {
      if (newAnalysisRequest) {
        await AnalysisRequest.update(newAnalysisRequest.id, { status: 'failed' });
      }
      toast({ title: "Analysis Failed", description: "An error occurred during analysis.", variant: "destructive" });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-8">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link to={createPageUrl("Home")}>
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to={createPageUrl("Dashboard")}>
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Secure AI Document Analysis</h1>
          <p className="text-lg text-slate-600">Our enterprise-grade LLM provides a secure analysis of your document's content and potential risks.</p>
        </motion.div>

        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Upload Your Document</CardTitle>
            <CardDescription>Your file is encrypted in transit and at rest. It will be deleted after analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-teal-500 bg-teal-50' : 'border-slate-300'}`}>
              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
              <label htmlFor="file-upload" className="cursor-pointer">
                <ShieldCheck className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">
                  {file ? file.name : "Drag & drop a secure file here, or click to select"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">PDF, DOCX, TXT, or other text-based files</p>
              </label>
            </div>
            <Button onClick={handleAnalyze} disabled={!file || isUploading || isAnalyzing} className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-lg py-6">
              {(isUploading || isAnalyzing) && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {isUploading ? "Uploading Securely..." : isAnalyzing ? "Analyzing..." : "Analyze Document"}
            </Button>
          </CardContent>
        </Card>

        {analysisResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="mt-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl"><BrainCircuit className="w-8 h-8 text-teal-600" /> Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Summary</h3>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-md">{analysisResult.summary}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Key Points</h3>
                  <ul className="list-disc list-inside space-y-2 bg-slate-50 p-4 rounded-md">
                    {analysisResult.key_points.map((point, index) => <li key={index} className="text-slate-600">{point}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Potential Risks</h3>
                  <ul className="list-disc list-inside space-y-2 bg-red-50 p-4 rounded-md">
                    {analysisResult.risks.length > 0 ? (
                      analysisResult.risks.map((risk, index) => <li key={index} className="text-red-700">{risk}</li>)
                    ) : (
                      <li className="text-green-700">No significant risks identified.</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
