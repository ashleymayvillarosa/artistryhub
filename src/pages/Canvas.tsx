import { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Pencil, Eraser, Square, Circle, Minus, Trash2,
  Download, Share2, Palette, Undo, Redo, Home,
  Users, Copy, Check
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}


export default function Canvas() {
  const { roomId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'line' | 'rectangle' | 'circle'>('pencil');
  const [color, setColor] = useState('#8B5CF6');
  const [lineWidth, setLineWidth] = useState(4);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [copied, setCopied] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const colors = [
    '#8B5CF6', '#EC4899', '#EF4444', '#F97316', '#EAB308',
    '#22C55E', '#06B6D4', '#3B82F6', '#000000', '#FFFFFF'
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialState]);
    setHistoryIndex(0);
  }, []);

  // WebSocket connection for collaboration
  useEffect(() => {
    if (roomId) {
      // In production, connect to actual WebSocket server
      console.log(`Connecting to room: ${roomId}`);
      // wsRef.current = new WebSocket(`ws://localhost:3001/room/${roomId}`);

      // Simulate connected users for demo
      const interval = setInterval(() => {
        setConnectedUsers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
      }, 5000);

      return () => {
        clearInterval(interval);
        wsRef.current?.close();
      };
    }
  }, [roomId]);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasCoordinates(e);
    setIsDrawing(true);
    setStartPoint(point);

    if (tool === 'pencil' || tool === 'eraser') {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const point = getCanvasCoordinates(e);

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(point.x, point.y);
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !startPoint) return;

    const endPoint = getCanvasCoordinates(e);

    // Draw shapes
    if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    } else if (tool === 'rectangle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(
        startPoint.x,
        startPoint.y,
        endPoint.x - startPoint.x,
        endPoint.y - startPoint.y
      );
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(endPoint.x - startPoint.x, 2) +
        Math.pow(endPoint.y - startPoint.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    setIsDrawing(false);
    setStartPoint(null);
    saveToHistory();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const newIndex = historyIndex + 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'artistry-creation.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const shareRoom = () => {
    const url = roomId
      ? window.location.href
      : `${window.location.origin}/canvas/${Math.random().toString(36).substr(2, 9)}`;

    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Toolbar */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            <Home className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-1 text-gray-400">
            <Palette className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">ArtistryHub</span>
          </div>
        </div>

        {roomId && (
          <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm">{connectedUsers} online</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Undo"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Redo"
          >
            <Redo className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-600 mx-2" />
          <button
            onClick={shareRoom}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share'}
          </button>
          <button
            onClick={downloadCanvas}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 bg-gray-800 flex flex-col items-center py-4 gap-2 border-r border-gray-700">
          <button
            onClick={() => setTool('pencil')}
            className={`p-3 rounded-lg transition-colors ${
              tool === 'pencil' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
            title="Pencil"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-3 rounded-lg transition-colors ${
              tool === 'eraser' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('line')}
            className={`p-3 rounded-lg transition-colors ${
              tool === 'line' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
            title="Line"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('rectangle')}
            className={`p-3 rounded-lg transition-colors ${
              tool === 'rectangle' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
            title="Rectangle"
          >
            <Square className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-3 rounded-lg transition-colors ${
              tool === 'circle' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
            title="Circle"
          >
            <Circle className="w-5 h-5" />
          </button>
          <div className="w-8 h-px bg-gray-600 my-2" />
          <button
            onClick={clearCanvas}
            className="p-3 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
            title="Clear Canvas"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-4 bg-gray-900 overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`w-full h-full bg-white rounded-lg shadow-xl ${
              tool === 'pencil' ? 'cursor-crosshair' :
              tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
            }`}
          />
        </div>

        {/* Right Panel - Colors & Settings */}
        <div className="w-64 bg-gray-800 p-4 border-l border-gray-700">
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Colors</h3>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                    color === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <span className="text-gray-400 text-sm">Custom</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Brush Size</h3>
            <input
              type="range"
              min="1"
              max="50"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-gray-400 text-sm mt-1">
              <span>1px</span>
              <span>{lineWidth}px</span>
              <span>50px</span>
            </div>
          </div>

          {roomId && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">Room ID</h3>
              <div className="flex items-center gap-2">
                <code className="text-purple-300 text-sm flex-1 truncate">{roomId}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
