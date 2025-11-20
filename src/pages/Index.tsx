import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Question {
  id: string;
  text: string;
  yesNextId: string | null;
  noNextId: string | null;
  yesMessage?: string;
  noMessage?: string;
  textAlign?: 'left' | 'center';
  yesMessageAlign?: 'left' | 'center';
  noMessageAlign?: 'left' | 'center';
}

const defaultQuestions: Question[] = [
  {
    id: '1',
    text: 'Вам нравится программирование?',
    yesNextId: '2',
    noNextId: null,
    yesMessage: '',
    noMessage: 'Попробуйте начать с простых задач!',
    textAlign: 'center',
    yesMessageAlign: 'center',
    noMessageAlign: 'center'
  },
  {
    id: '2',
    text: 'Вы знаете JavaScript?',
    yesNextId: null,
    noNextId: null,
    yesMessage: 'Отлично! Вы готовы к разработке.',
    noMessage: 'Рекомендуем изучить основы JS.',
    textAlign: 'center',
    yesMessageAlign: 'center',
    noMessageAlign: 'center'
  }
];

const Index = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [finalMessage, setFinalMessage] = useState<string>('');
  const [finalMessageAlign, setFinalMessageAlign] = useState<'left' | 'center'>('center');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newYesNextId, setNewYesNextId] = useState<string>('none');
  const [newNoNextId, setNewNoNextId] = useState<string>('none');
  const [newYesMessage, setNewYesMessage] = useState('');
  const [newNoMessage, setNewNoMessage] = useState('');
  const [newTextAlign, setNewTextAlign] = useState<'left' | 'center'>('center');
  const [newYesMessageAlign, setNewYesMessageAlign] = useState<'left' | 'center'>('center');
  const [newNoMessageAlign, setNewNoMessageAlign] = useState<'left' | 'center'>('center');
  
  const [bgColor, setBgColor] = useState('#dbeafe');
  const [cardBgColor, setCardBgColor] = useState('#ffffff');
  const [primaryBtnColor, setPrimaryBtnColor] = useState('#3b82f6');
  const [secondaryBtnColor, setSecondaryBtnColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#0f172a');

  useEffect(() => {
    const saved = localStorage.getItem('surveyQuestions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setQuestions(parsed);
      if (parsed.length > 0) {
        setCurrentQuestionId(parsed[0].id);
      }
    } else {
      setQuestions(defaultQuestions);
      setCurrentQuestionId(defaultQuestions[0].id);
      localStorage.setItem('surveyQuestions', JSON.stringify(defaultQuestions));
    }

    const savedColors = localStorage.getItem('surveyColors');
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      setBgColor(colors.bgColor || '#dbeafe');
      setCardBgColor(colors.cardBgColor || '#ffffff');
      setPrimaryBtnColor(colors.primaryBtnColor || '#3b82f6');
      setSecondaryBtnColor(colors.secondaryBtnColor || '#ffffff');
      setTextColor(colors.textColor || '#0f172a');
    }
  }, []);

  const currentQuestion = questions.find(q => q.id === currentQuestionId);

  const handleAnswer = (answer: 'yes' | 'no') => {
    if (!currentQuestion) return;

    const nextId = answer === 'yes' ? currentQuestion.yesNextId : currentQuestion.noNextId;
    const message = answer === 'yes' ? currentQuestion.yesMessage : currentQuestion.noMessage;
    const messageAlign = answer === 'yes' ? currentQuestion.yesMessageAlign : currentQuestion.noMessageAlign;

    if (nextId) {
      setCurrentQuestionId(nextId);
      setFinalMessage('');
    } else if (message) {
      setFinalMessage(message);
      setFinalMessageAlign(messageAlign || 'center');
      setCurrentQuestionId(null);
    } else {
      setFinalMessage('Спасибо за прохождение опроса!');
      setCurrentQuestionId(null);
    }
  };

  const handleRestart = () => {
    if (questions.length > 0) {
      setCurrentQuestionId(questions[0].id);
      setFinalMessage('');
    }
  };

  const handleSaveQuestion = () => {
    if (!newQuestionText.trim()) {
      toast.error('Введите текст вопроса');
      return;
    }

    if (editingQuestion) {
      const updated = questions.map(q =>
        q.id === editingQuestion.id
          ? {
              ...q,
              text: newQuestionText,
              yesNextId: newYesNextId === 'none' ? null : newYesNextId,
              noNextId: newNoNextId === 'none' ? null : newNoNextId,
              yesMessage: newYesMessage,
              noMessage: newNoMessage,
              textAlign: newTextAlign,
              yesMessageAlign: newYesMessageAlign,
              noMessageAlign: newNoMessageAlign
            }
          : q
      );
      setQuestions(updated);
      localStorage.setItem('surveyQuestions', JSON.stringify(updated));
      toast.success('Вопрос обновлен');
      
      if (currentQuestionId === editingQuestion.id) {
        handleRestart();
      }
    } else {
      const newQuestion: Question = {
        id: Date.now().toString(),
        text: newQuestionText,
        yesNextId: newYesNextId === 'none' ? null : newYesNextId,
        noNextId: newNoNextId === 'none' ? null : newNoNextId,
        yesMessage: newYesMessage,
        noMessage: newNoMessage,
        textAlign: newTextAlign,
        yesMessageAlign: newYesMessageAlign,
        noMessageAlign: newNoMessageAlign
      };
      const updated = [...questions, newQuestion];
      setQuestions(updated);
      localStorage.setItem('surveyQuestions', JSON.stringify(updated));
      toast.success('Вопрос добавлен');
    }

    resetForm();
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestionText(question.text);
    setNewYesNextId(question.yesNextId || 'none');
    setNewNoNextId(question.noNextId || 'none');
    setNewYesMessage(question.yesMessage || '');
    setNewNoMessage(question.noMessage || '');
    setNewTextAlign(question.textAlign || 'center');
    setNewYesMessageAlign(question.yesMessageAlign || 'center');
    setNewNoMessageAlign(question.noMessageAlign || 'center');
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    localStorage.setItem('surveyQuestions', JSON.stringify(updated));
    toast.success('Вопрос удален');
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setNewQuestionText('');
    setNewYesNextId('none');
    setNewNoNextId('none');
    setNewYesMessage('');
    setNewNoMessage('');
    setNewTextAlign('center');
    setNewYesMessageAlign('center');
    setNewNoMessageAlign('center');
  };

  const handleResetToDefault = () => {
    if (confirm('Вы уверены? Все текущие вопросы будут удалены.')) {
      setQuestions(defaultQuestions);
      localStorage.setItem('surveyQuestions', JSON.stringify(defaultQuestions));
      setCurrentQuestionId(defaultQuestions[0].id);
      setFinalMessage('');
      toast.success('Вопросы сброшены к настройкам по умолчанию');
    }
  };

  const handleSaveColors = () => {
    const colors = { bgColor, cardBgColor, primaryBtnColor, secondaryBtnColor, textColor };
    localStorage.setItem('surveyColors', JSON.stringify(colors));
    toast.success('Цветовая схема сохранена');
  };

  const handleExportQuestions = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey-questions-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Опрос экспортирован');
  };

  const handleExportHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Опрос</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #f8fafc 0%, ${bgColor} 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            width: 100%;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            animation: fadeIn 0.6s ease-out;
        }
        h1 {
            font-size: 36px;
            font-weight: bold;
            color: ${textColor};
        }
        .card {
            background: ${cardBgColor};
            padding: 48px;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            animation: slideUp 0.6s ease-out;
        }
        .question-container {
            display: flex;
            flex-direction: column;
            gap: 32px;
        }
        .question-text {
            font-size: 28px;
            font-weight: 600;
            color: ${textColor};
            line-height: 1.6;
            white-space: pre-wrap;
        }
        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
        }
        button {
            min-width: 128px;
            padding: 12px 24px;
            font-size: 18px;
            font-weight: 500;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-primary {
            background: ${primaryBtnColor};
            color: white;
        }
        .btn-primary:hover {
            opacity: 0.9;
            transform: scale(1.05);
        }
        .btn-secondary {
            background: ${secondaryBtnColor};
            color: ${textColor};
            border: 2px solid #e2e8f0;
        }
        .btn-secondary:hover {
            opacity: 0.9;
            transform: scale(1.05);
        }
        .final-message {
            display: flex;
            flex-direction: column;
            gap: 24px;
            align-items: center;
            animation: fadeIn 0.6s ease-out;
        }
        .icon-check {
            width: 64px;
            height: 64px;
            background: ${primaryBtnColor}1a;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: ${primaryBtnColor};
        }
        .message-text {
            font-size: 24px;
            font-weight: 600;
            color: ${textColor};
            white-space: pre-wrap;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        @media (max-width: 768px) {
            h1 { font-size: 28px; }
            .card { padding: 32px 24px; }
            .question-text { font-size: 24px; }
            .message-text { font-size: 20px; }
            .buttons { flex-direction: column; }
            button { width: 100%; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Опрос</h1>
        </div>
        <div class="card">
            <div id="app"></div>
        </div>
    </div>

    <script>
        const questions = ${JSON.stringify(questions)};
        
        let currentQuestionId = questions.length > 0 ? questions[0].id : null;
        let finalMessage = '';
        let finalMessageAlign = 'center';

        function render() {
            const app = document.getElementById('app');
            const currentQuestion = questions.find(q => q.id === currentQuestionId);

            if (currentQuestion) {
                const align = currentQuestion.textAlign || 'center';
                app.innerHTML = \`
                    <div class="question-container">
                        <div class="text-\${align}">
                            <div class="question-text">\${currentQuestion.text}</div>
                        </div>
                        <div class="buttons">
                            <button class="btn-primary" onclick="handleAnswer('yes')">Да</button>
                            <button class="btn-secondary" onclick="handleAnswer('no')">Нет</button>
                        </div>
                    </div>
                \`;
            } else if (finalMessage) {
                app.innerHTML = \`
                    <div class="final-message">
                        <div class="icon-check">✓</div>
                        <div class="text-\${finalMessageAlign}">
                            <div class="message-text">\${finalMessage}</div>
                        </div>
                        <button class="btn-secondary" onclick="restart()">Пройти заново</button>
                    </div>
                \`;
            } else {
                app.innerHTML = \`
                    <div class="final-message">
                        <div class="message-text">Вопросы не настроены</div>
                    </div>
                \`;
            }
        }

        function handleAnswer(answer) {
            const currentQuestion = questions.find(q => q.id === currentQuestionId);
            if (!currentQuestion) return;

            const nextId = answer === 'yes' ? currentQuestion.yesNextId : currentQuestion.noNextId;
            const message = answer === 'yes' ? currentQuestion.yesMessage : currentQuestion.noMessage;
            const messageAlign = answer === 'yes' ? currentQuestion.yesMessageAlign : currentQuestion.noMessageAlign;

            if (nextId) {
                currentQuestionId = nextId;
                finalMessage = '';
            } else if (message) {
                finalMessage = message;
                finalMessageAlign = messageAlign || 'center';
                currentQuestionId = null;
            } else {
                currentQuestionId = null;
            }

            render();
        }

        function restart() {
            if (questions.length > 0) {
                currentQuestionId = questions[0].id;
                finalMessage = '';
                render();
            }
        }

        render();
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('HTML файл экспортирован');
  };

  const handleImportQuestions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setQuestions(imported);
        localStorage.setItem('surveyQuestions', JSON.stringify(imported));
        if (imported.length > 0) {
          setCurrentQuestionId(imported[0].id);
          setFinalMessage('');
        }
        toast.success('Опрос импортирован');
      } catch (error) {
        toast.error('Ошибка импорта файла');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: `linear-gradient(135deg, #f8fafc 0%, ${bgColor} 100%)` }}
    >
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-heading font-bold" style={{ color: textColor }}>Опрос</h1>
          <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Icon name="Settings" size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="font-heading">Настройки опроса</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-heading font-semibold text-lg">
                    {editingQuestion ? 'Редактировать вопрос' : 'Добавить вопрос'}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="question-text">Текст вопроса</Label>
                    <Textarea
                      id="question-text"
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Введите вопрос"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text-align">Выравнивание текста вопроса</Label>
                    <Select value={newTextAlign} onValueChange={(value: 'left' | 'center') => setNewTextAlign(value)}>
                      <SelectTrigger id="text-align">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">По центру</SelectItem>
                        <SelectItem value="left">По левому краю</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yes-next">Следующий вопрос (Да)</Label>
                      <Select value={newYesNextId} onValueChange={setNewYesNextId}>
                        <SelectTrigger id="yes-next">
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Нет</SelectItem>
                          {questions.map(q => (
                            <SelectItem key={q.id} value={q.id}>
                              {q.text.substring(0, 30)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="no-next">Следующий вопрос (Нет)</Label>
                      <Select value={newNoNextId} onValueChange={setNewNoNextId}>
                        <SelectTrigger id="no-next">
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Нет</SelectItem>
                          {questions.map(q => (
                            <SelectItem key={q.id} value={q.id}>
                              {q.text.substring(0, 30)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yes-message">Финальное сообщение (Да)</Label>
                    <Textarea
                      id="yes-message"
                      value={newYesMessage}
                      onChange={(e) => setNewYesMessage(e.target.value)}
                      placeholder="Сообщение при ответе 'Да'"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yes-message-align">Выравнивание сообщения (Да)</Label>
                    <Select value={newYesMessageAlign} onValueChange={(value: 'left' | 'center') => setNewYesMessageAlign(value)}>
                      <SelectTrigger id="yes-message-align">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">По центру</SelectItem>
                        <SelectItem value="left">По левому краю</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="no-message">Финальное сообщение (Нет)</Label>
                    <Textarea
                      id="no-message"
                      value={newNoMessage}
                      onChange={(e) => setNewNoMessage(e.target.value)}
                      placeholder="Сообщение при ответе 'Нет'"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="no-message-align">Выравнивание сообщения (Нет)</Label>
                    <Select value={newNoMessageAlign} onValueChange={(value: 'left' | 'center') => setNewNoMessageAlign(value)}>
                      <SelectTrigger id="no-message-align">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">По центру</SelectItem>
                        <SelectItem value="left">По левому краю</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveQuestion} className="flex-1">
                      {editingQuestion ? 'Обновить' : 'Добавить'}
                    </Button>
                    {editingQuestion && (
                      <Button variant="outline" onClick={resetForm}>
                        Отмена
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-heading font-semibold text-lg mb-4">Все вопросы</h3>
                  <div className="space-y-2">
                    {questions.map((q, index) => (
                      <Card key={q.id} className="p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {index + 1}. {q.text}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditQuestion(q)}
                            >
                              <Icon name="Pencil" size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteQuestion(q.id)}
                            >
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleExportQuestions}
                    >
                      <Icon name="Download" size={16} className="mr-2" />
                      JSON
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleExportHTML}
                    >
                      <Icon name="FileCode" size={16} className="mr-2" />
                      HTML
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full col-span-2"
                      onClick={() => document.getElementById('import-file')?.click()}
                    >
                      <Icon name="Upload" size={16} className="mr-2" />
                      Импорт JSON
                    </Button>
                    <input
                      id="import-file"
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportQuestions}
                    />
                  </div>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleResetToDefault}
                  >
                    <Icon name="RotateCcw" size={16} className="mr-2" />
                    Сбросить к настройкам по умолчанию
                  </Button>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <h3 className="font-heading font-semibold text-lg">Цветовая схема</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="bg-color">Цвет фона</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bg-color"
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card-bg-color">Цвет карточки</Label>
                      <div className="flex gap-2">
                        <Input
                          id="card-bg-color"
                          type="color"
                          value={cardBgColor}
                          onChange={(e) => setCardBgColor(e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={cardBgColor}
                          onChange={(e) => setCardBgColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primary-btn-color">Цвет кнопки "Да"</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-btn-color"
                          type="color"
                          value={primaryBtnColor}
                          onChange={(e) => setPrimaryBtnColor(e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={primaryBtnColor}
                          onChange={(e) => setPrimaryBtnColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondary-btn-color">Цвет кнопки "Нет"</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary-btn-color"
                          type="color"
                          value={secondaryBtnColor}
                          onChange={(e) => setSecondaryBtnColor(e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={secondaryBtnColor}
                          onChange={(e) => setSecondaryBtnColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="text-color">Цвет текста</Label>
                      <div className="flex gap-2">
                        <Input
                          id="text-color"
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <Button className="w-full" onClick={handleSaveColors}>
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить цвета
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Card className="p-8 md:p-12 shadow-xl animate-slide-up" style={{ backgroundColor: cardBgColor }}>
          {currentQuestion ? (
            <div className="space-y-8">
              <div className={currentQuestion.textAlign === 'left' ? 'text-left' : 'text-center'}>
                <h2 className="text-2xl md:text-3xl font-heading font-semibold leading-relaxed whitespace-pre-wrap" style={{ color: textColor }}>
                  {currentQuestion.text}
                </h2>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => handleAnswer('yes')}
                  className="min-w-32 text-lg hover:scale-105 transition-transform"
                  style={{ backgroundColor: primaryBtnColor, color: 'white' }}
                >
                  Да
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleAnswer('no')}
                  className="min-w-32 text-lg hover:scale-105 transition-transform"
                  style={{ backgroundColor: secondaryBtnColor, color: textColor }}
                >
                  Нет
                </Button>
              </div>
            </div>
          ) : finalMessage ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryBtnColor}1a` }}>
                  <Icon name="Check" size={32} style={{ color: primaryBtnColor }} />
                </div>
              </div>
              <p className={`text-xl md:text-2xl font-heading font-semibold whitespace-pre-wrap ${finalMessageAlign === 'left' ? 'text-left' : 'text-center'}`} style={{ color: textColor }}>
                {finalMessage}
              </p>
              <div className="flex justify-center">
                <Button onClick={handleRestart} variant="outline" size="lg" style={{ backgroundColor: secondaryBtnColor, color: textColor }}>
                  Пройти заново
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 animate-fade-in">
              <p className="text-xl text-muted-foreground">
                Вопросы не настроены
              </p>
              <Button onClick={() => setIsSettingsOpen(true)}>
                Открыть настройки
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;