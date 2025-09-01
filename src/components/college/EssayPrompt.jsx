import React, { useState, useEffect } from 'react';
import { Essay } from '@/api/entities';
import { SendEmail } from '@/api/integrations';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Save, Send, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EssayPrompt({ prompt, college, student }) {
  const [essay, setEssay] = useState(null);
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEssay = async () => {
      if (student && college) {
        const existingEssays = await Essay.filter({
          student_id: student.id,
          college_name: college.college_name,
          prompt: prompt,
        }, '-updated_date', 1);

        if (existingEssays.length > 0) {
          const foundEssay = existingEssays[0];
          setEssay(foundEssay);
          setContent(foundEssay.content);
        }
      }
    };
    fetchEssay();
  }, [student, college, prompt]);
  
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [content]);

  const handleSave = async () => {
    if (!content.trim() || !student) return;
    setIsSaving(true);
    try {
      const essayData = {
        student_id: student.id,
        title: `${college.college_name}: ${prompt.slice(0, 30)}...`,
        prompt: prompt,
        content: content,
        college_name: college.college_name,
        essay_type: 'supplemental',
        word_count: wordCount,
        status: essay?.status === 'submitted_for_review' ? 'submitted_for_review' : 'draft',
      };

      if (essay) {
        const updatedEssay = await Essay.update(essay.id, essayData);
        setEssay(updatedEssay);
      } else {
        const newEssay = await Essay.create(essayData);
        setEssay(newEssay);
      }
    } catch (error) {
      console.error("Error saving essay:", error);
    }
    setIsSaving(false);
  };

  const handleSubmitForReview = async (e) => {
    e.preventDefault();
    if (!reviewerEmail.trim() || !essay) return;
    setIsSubmitting(true);
    try {
      const updatedEssay = await Essay.update(essay.id, {
        reviewers: [...(essay.reviewers || []), reviewerEmail],
        status: 'submitted_for_review',
      });
      setEssay(updatedEssay);
      
      await SendEmail({
        to: reviewerEmail,
        subject: `Essay Review Request from ${student.first_name} for ${college.college_name}`,
        body: `
          <p>Hello,</p>
          <p>${student.first_name} ${student.last_name} has requested your review for their college application essay.</p>
          <hr />
          <h3>${college.college_name}</h3>
          <p><strong>Prompt:</strong> ${prompt}</p>
          <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${content}</div>
          <hr />
          <p>You can reply to this email with your feedback.</p>
          <p>Thank you!</p>
        `
      });

      setReviewerEmail('');
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error submitting for review:", error);
    }
    setIsSubmitting(false);
  };

  const isSubmitted = essay?.status === 'submitted_for_review';

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
      <p className="text-base font-semibold text-slate-800">{prompt}</p>
      
      <div className="space-y-2">
        <Label htmlFor={`essay-${prompt.slice(0, 10)}`} className="text-slate-600">Your Response</Label>
        <Textarea
          id={`essay-${prompt.slice(0, 10)}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your essay here..."
          className="min-h-[250px] text-base leading-relaxed bg-white"
          disabled={isSubmitted}
        />
        <div className="text-right text-sm text-slate-500">
          Word Count: {wordCount}
        </div>
      </div>
      
      {isSubmitted ? (
        <Alert className="bg-emerald-50 border-emerald-200">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-800">Submitted for Review</AlertTitle>
          <AlertDescription className="text-emerald-700">
            This essay has been sent for review to: {essay.reviewers.join(', ')}.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleSave} disabled={isSaving || !content.trim()}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Progress'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowReviewForm(!showReviewForm)}
            disabled={!essay}
          >
            <Send className="w-4 h-4 mr-2" />
            Send for Review
          </Button>
        </div>
      )}

      {!isSubmitted && showReviewForm && essay && (
        <form onSubmit={handleSubmitForReview} className="p-4 bg-slate-100 border border-slate-200 rounded-lg space-y-3 animate-in fade-in-50">
          <Label htmlFor="reviewerEmail" className="font-semibold">Reviewer's Email</Label>
          <div className="flex gap-3">
            <Input
              id="reviewerEmail"
              type="email"
              value={reviewerEmail}
              onChange={(e) => setReviewerEmail(e.target.value)}
              placeholder="reviewer@example.com"
              required
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}