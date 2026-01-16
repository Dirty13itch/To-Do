import React, { useState, useReducer, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, Check, ChevronDown, ChevronRight, ChevronUp,
  Briefcase, Home, Zap, Clock, ShoppingCart, Target,
  MoreHorizontal, X, Edit3, Coffee, Book, Wrench, Heart,
  Lock, Eye, EyeOff, Command, Search, Layers, Settings,
  DollarSign, Lightbulb, GraduationCap, Stethoscope, Gift,
  Brain, Scale, Maximize2, Minimize2, ArrowLeft, Shield
} from 'lucide-react';

const ICONS = {
  briefcase: Briefcase, home: Home, zap: Zap, clock: Clock,
  cart: ShoppingCart, target: Target, coffee: Coffee,
  book: Book, wrench: Wrench, heart: Heart,
  dollar: DollarSign, lightbulb: Lightbulb, graduation: GraduationCap,
  health: Stethoscope, gift: Gift, search: Search,
  brain: Brain, scale: Scale
};

const COLORS = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', accent: 'bg-blue-500', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', accent: 'bg-purple-500', text: 'text-purple-400' },
  green: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', accent: 'bg-emerald-500', text: 'text-emerald-400' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', accent: 'bg-orange-500', text: 'text-orange-400' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', accent: 'bg-pink-500', text: 'text-pink-400' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', accent: 'bg-cyan-500', text: 'text-cyan-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', accent: 'bg-amber-500', text: 'text-amber-400' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', accent: 'bg-rose-500', text: 'text-rose-400' },
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const initialState = {
  // Normal visible lists
  lists: [
    { id: 'work', name: 'Work', icon: 'briefcase', color: 'blue', collapsed: false, dimmed: false, docked: false, private: false, items: [
      { id: 'w1', text: 'Finish quarterly report', completed: false, subtasks: [] },
      { id: 'w2', text: 'Schedule 1:1 with manager', completed: false, subtasks: [] },
      { id: 'w3', text: 'Review pull requests', completed: true, subtasks: [] },
    ]},
    { id: 'errands', name: 'Errands', icon: 'cart', color: 'orange', collapsed: false, dimmed: false, docked: false, private: false, items: [
      { id: 'e1', text: 'Grocery run', completed: false, subtasks: [] },
      { id: 'e2', text: 'Pick up dry cleaning', completed: false, subtasks: [] },
      { id: 'e3', text: 'Return Amazon package', completed: true, subtasks: [] },
    ]},
    { id: 'home', name: 'Home', icon: 'home', color: 'amber', collapsed: false, dimmed: false, docked: false, private: false, items: [
      { id: 'h1', text: 'Fix leaky faucet', completed: false, subtasks: [] },
      { id: 'h2', text: 'Change HVAC filter', completed: false, subtasks: [] },
    ]},
    { id: 'learning', name: 'Learning', icon: 'graduation', color: 'purple', collapsed: false, dimmed: false, docked: false, private: false, items: [
      { id: 'l1', text: 'Finish Python course', completed: false, subtasks: [] },
      { id: 'l2', text: 'Read "Atomic Habits"', completed: false, subtasks: [] },
    ]},
    { id: 'someday', name: 'Someday', icon: 'clock', color: 'amber', collapsed: false, dimmed: true, docked: true, private: false, items: [
      { id: 's1', text: 'Learn piano', completed: false, subtasks: [] },
      { id: 's2', text: 'Visit Japan', completed: false, subtasks: [] },
    ]},
    // PRIVATE LISTS - completely hidden from main UI
    { id: 'jobsearch', name: 'Job Search', icon: 'search', color: 'purple', collapsed: false, dimmed: false, docked: false, private: true, items: [
      { id: 'js1', text: 'Update LinkedIn quietly', completed: true, subtasks: [] },
      { id: 'js2', text: 'Apply to Stripe opening', completed: false, subtasks: [] },
      { id: 'js3', text: 'Prep for Google phone screen', completed: false, subtasks: [] },
      { id: 'js4', text: 'Research salary ranges', completed: false, subtasks: [] },
    ]},
    { id: 'therapy', name: 'Therapy', icon: 'brain', color: 'cyan', collapsed: false, dimmed: false, docked: false, private: true, items: [
      { id: 't1', text: 'Journal about work anxiety', completed: false, subtasks: [] },
      { id: 't2', text: 'Practice grounding exercises', completed: true, subtasks: [] },
      { id: 't3', text: 'Topics for Thursday session', completed: false, subtasks: [] },
    ]},
    { id: 'health', name: 'Health', icon: 'health', color: 'green', collapsed: false, dimmed: false, docked: false, private: true, items: [
      { id: 'hl1', text: 'Schedule colonoscopy', completed: false, subtasks: [] },
      { id: 'hl2', text: 'Refill Lexapro', completed: false, subtasks: [] },
      { id: 'hl3', text: 'Ask doctor about back pain', completed: false, subtasks: [] },
    ]},
    { id: 'finances', name: 'Finances', icon: 'dollar', color: 'green', collapsed: false, dimmed: false, docked: false, private: true, items: [
      { id: 'f1', text: 'Pay off credit card #2', completed: false, subtasks: [] },
      { id: 'f2', text: 'Research debt consolidation', completed: false, subtasks: [] },
      { id: 'f3', text: 'Hide birthday gift purchase', completed: true, subtasks: [] },
    ]},
    { id: 'gifts', name: 'Gift Ideas', icon: 'gift', color: 'pink', collapsed: false, dimmed: false, docked: false, private: true, items: [
      { id: 'g1', text: "Sarah's 40th surprise party", completed: false, subtasks: [] },
      { id: 'g2', text: "Kids' Christmas list", completed: false, subtasks: [] },
    ]},
  ],
  privatePin: '1234', // PIN to access private folder
  focusedListId: null,
  selectedTaskId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_ITEM': return { ...state, lists: state.lists.map(list => list.id === action.listId ? { ...list, items: list.items.map(item => item.id === action.itemId ? { ...item, completed: !item.completed } : item)} : list)};
    case 'ADD_ITEM': return { ...state, lists: state.lists.map(list => list.id === action.listId ? { ...list, items: [...list.items, { id: generateId(), text: action.text, completed: false, subtasks: [] }] } : list)};
    case 'DELETE_ITEM': return { ...state, lists: state.lists.map(list => list.id === action.listId ? { ...list, items: list.items.filter(item => item.id !== action.itemId) } : list)};
    case 'UPDATE_ITEM': return { ...state, lists: state.lists.map(list => list.id === action.listId ? { ...list, items: list.items.map(item => item.id === action.itemId ? { ...item, ...action.updates } : item)} : list)};
    case 'ADD_LIST': const colorKeys = Object.keys(COLORS); return { ...state, lists: [...state.lists, { id: generateId(), name: action.name || 'New List', icon: 'target', color: colorKeys[Math.floor(Math.random() * colorKeys.length)], collapsed: false, dimmed: false, docked: false, private: action.private || false, items: [] }] };
    case 'DELETE_LIST': return { ...state, lists: state.lists.filter(list => list.id !== action.listId), focusedListId: state.focusedListId === action.listId ? null : state.focusedListId };
    case 'UPDATE_LIST': return { ...state, lists: state.lists.map(list => list.id === action.listId ? { ...list, ...action.updates } : list) };
    case 'TOGGLE_COLLAPSE': return { ...state, lists: state.lists.map(list => list.id === action.listId ? { ...list, collapsed: !list.collapsed } : list) };
    case 'TOGGLE_DIM': return { ...state, lists: state.lists.map(list => list.id === action.listId ? { ...list, dimmed: !list.dimmed } : list) };
    case 'TOGGLE_DOCK': return { ...state, lists: state.lists.map(list => list.id === action.listId ? { ...list, docked: !list.docked } : list) };
    case 'TOGGLE_PRIVATE': return { ...state, lists: state.lists.map(list => list.id === action.listId ? { ...list, private: !list.private } : list) };
    case 'SET_FOCUS': return { ...state, focusedListId: action.listId };
    case 'CLEAR_FOCUS': return { ...state, focusedListId: null };
    case 'SET_PIN': return { ...state, privatePin: action.pin };
    default: return state;
  }
}

// PIN Entry
function PinEntry({ onSubmit, onCancel, title, subtitle }) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  
  useEffect(() => { inputRefs[0].current?.focus(); }, []);
  
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError(false);
    if (value && index < 3) inputRefs[index + 1].current?.focus();
    if (newPin.every(d => d !== '') && index === 3) {
      const result = onSubmit(newPin.join(''));
      if (result === false) { setError(true); setPin(['', '', '', '']); inputRefs[0].current?.focus(); }
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) inputRefs[index - 1].current?.focus();
    if (e.key === 'Escape') onCancel();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-xs shadow-2xl border border-slate-700 text-center" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
          <Lock size={20} className="text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        <p className="text-slate-400 text-sm mb-6">{subtitle}</p>
        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, i) => (
            <input key={i} ref={inputRefs[i]} type="password" inputMode="numeric" maxLength={1} value={digit}
              onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-11 h-11 text-center text-xl font-bold bg-slate-700 rounded-xl border-2 outline-none transition-all ${error ? 'border-rose-500' : 'border-slate-600 focus:border-blue-500'}`}
            />
          ))}
        </div>
        {error && <p className="text-rose-400 text-sm mb-4">Incorrect PIN</p>}
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-200 text-sm">Cancel</button>
      </div>
    </div>
  );
}

// Settings Panel
function SettingsPanel({ isOpen, onClose, onOpenPrivate, privateListCount }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-700 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h2 className="font-semibold">Settings</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        
        <div className="p-2">
          {/* Private folder - the key feature, looks boring/utilitarian */}
          <button 
            onClick={onOpenPrivate}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center">
              <Lock size={16} className="text-slate-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">Private</div>
              <div className="text-xs text-slate-500">Locked lists</div>
            </div>
            {privateListCount > 0 && (
              <span className="text-xs text-slate-500">{privateListCount}</span>
            )}
            <ChevronRight size={16} className="text-slate-500" />
          </button>
          
          <div className="my-2 border-t border-slate-700" />
          
          {/* Other boring settings */}
          <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400">
            <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center">
              <Eye size={16} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm">Appearance</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
          
          <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400">
            <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center">
              <Shield size={16} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm">Security</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Private Folder View - shows only private lists
function PrivateFolderView({ lists, dispatch, onClose }) {
  const [newItemText, setNewItemText] = useState({});
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  
  const handleAddItem = (listId, e) => {
    e.preventDefault();
    const text = newItemText[listId];
    if (text?.trim()) {
      dispatch({ type: 'ADD_ITEM', listId, text: text.trim() });
      setNewItemText({ ...newItemText, [listId]: '' });
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-slate-500" />
            <h1 className="font-semibold">Private</h1>
          </div>
        </div>
      </header>
      
      {/* Private lists grid */}
      <main className="flex-1 overflow-auto p-4">
        <div className="grid gap-3 auto-rows-fr" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {lists.map(list => {
            const colors = COLORS[list.color];
            const IconComponent = ICONS[list.icon] || Target;
            const totalItems = list.items.length;
            const completedItems = list.items.filter(i => i.completed).length;
            
            return (
              <div key={list.id} className={`flex flex-col rounded-xl bg-slate-900/80 border ${colors.border} h-full`}>
                <div className={`p-3.5 rounded-t-xl ${colors.bg}`}>
                  <div className="flex items-center gap-2.5">
                    <button onClick={() => dispatch({ type: 'TOGGLE_COLLAPSE', listId: list.id })} className={colors.text}>
                      {list.collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <div className={`p-1.5 rounded-lg ${colors.accent}`}>
                      <IconComponent size={14} className="text-white" />
                    </div>
                    <h3 className="flex-1 font-medium text-sm text-white truncate">{list.name}</h3>
                    <span className={`text-xs ${colors.text}`}>{completedItems}/{totalItems}</span>
                  </div>
                </div>
                
                {!list.collapsed && (
                  <>
                    <div className="flex-1 overflow-y-auto p-1.5 min-h-0">
                      {list.items.map(item => (
                        <div key={item.id}
                          onClick={() => setSelectedTaskId(item.id)}
                          className={`group flex items-start gap-2.5 py-2 px-2.5 rounded-lg cursor-pointer transition-all ${selectedTaskId === item.id ? 'bg-slate-700/60' : 'hover:bg-slate-800/60'} ${item.completed ? 'opacity-50' : ''}`}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); dispatch({ type: 'TOGGLE_ITEM', listId: list.id, itemId: item.id }); }}
                            className={`flex-shrink-0 w-[18px] h-[18px] rounded border-2 flex items-center justify-center mt-0.5 ${item.completed ? `${colors.accent} border-transparent` : 'border-slate-500'}`}
                          >
                            {item.completed && <Check size={10} className="text-white" strokeWidth={3} />}
                          </button>
                          <span className={`flex-1 text-sm ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{item.text}</span>
                          <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_ITEM', listId: list.id, itemId: item.id }); }}
                            className="p-1 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      {list.items.length === 0 && <div className="py-6 text-center text-slate-600 text-xs">No tasks</div>}
                    </div>
                    
                    <form onSubmit={(e) => handleAddItem(list.id, e)} className="p-2.5 border-t border-slate-800/50">
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={newItemText[list.id] || ''}
                          onChange={(e) => setNewItemText({ ...newItemText, [list.id]: e.target.value })}
                          placeholder="Add task..."
                          className="flex-1 px-2.5 py-1.5 bg-slate-800/50 text-white rounded-lg text-sm border border-slate-700/50 focus:border-slate-600 focus:outline-none placeholder-slate-500"
                        />
                        <button type="submit" disabled={!newItemText[list.id]?.trim()} className={`px-2.5 ${colors.accent} rounded-lg text-white disabled:opacity-30`}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            );
          })}
          
          {/* Add new private list */}
          <button
            onClick={() => dispatch({ type: 'ADD_LIST', private: true })}
            className="h-full min-h-28 rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-1.5 text-slate-600 hover:border-slate-700 hover:text-slate-500"
          >
            <Plus size={20} />
            <span className="text-xs">New Private List</span>
          </button>
        </div>
      </main>
      
      <footer className="flex-shrink-0 px-4 py-3 bg-slate-900/50 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-600">These lists are hidden from the main view</p>
      </footer>
    </div>
  );
}

// Quick Add
function QuickAdd({ isOpen, onClose, lists, dispatch }) {
  const [text, setText] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const inputRef = useRef();
  
  useEffect(() => {
    if (isOpen) {
      setText('');
      const available = lists.filter(l => !l.private && !l.docked);
      setSelectedList(available[0]?.id || null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, lists]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && selectedList) {
      dispatch({ type: 'ADD_ITEM', listId: selectedList, text: text.trim() });
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  const availableLists = lists.filter(l => !l.private);
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-3 border-b border-slate-700">
            <input ref={inputRef} type="text" value={text} onChange={e => setText(e.target.value)} placeholder="What needs to be done?"
              className="w-full bg-transparent text-white outline-none placeholder-slate-500" onKeyDown={e => e.key === 'Escape' && onClose()}
            />
          </div>
          <div className="px-4 py-3 flex items-center justify-between bg-slate-800/50">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Add to:</span>
              <select value={selectedList || ''} onChange={e => setSelectedList(e.target.value)} className="bg-slate-700 text-white px-2 py-1 rounded text-sm outline-none">
                {availableLists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-3 py-1 text-slate-400 hover:text-white text-sm">Cancel</button>
              <button type="submit" disabled={!text.trim()} className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 disabled:opacity-50">Add</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Task Item
function TaskItem({ item, listId, listColor, dispatch, isSelected, onSelect }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const colors = COLORS[listColor];
  
  const handleSave = () => {
    if (editText.trim()) dispatch({ type: 'UPDATE_ITEM', listId, itemId: item.id, updates: { text: editText.trim() } });
    setIsEditing(false);
  };
  
  return (
    <div onClick={() => onSelect(item.id)}
      className={`group relative flex items-start gap-2.5 py-2 px-2.5 rounded-lg transition-all cursor-pointer ${isSelected ? 'bg-slate-700/60 ring-1 ring-slate-600' : 'hover:bg-slate-800/60'} ${item.completed ? 'opacity-50' : ''}`}
    >
      <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'TOGGLE_ITEM', listId, itemId: item.id }); }}
        className={`flex-shrink-0 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all mt-0.5 ${item.completed ? `${colors.accent} border-transparent` : `border-slate-500 hover:border-slate-400`}`}
      >
        {item.completed && <Check size={10} className="text-white" strokeWidth={3} />}
      </button>
      
      <div className="flex-1 min-w-0 pr-6">
        {isEditing ? (
          <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onBlur={handleSave}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') { setEditText(item.text); setIsEditing(false); } }}
            className="w-full bg-slate-700 text-white px-2 py-0.5 rounded text-sm outline-none" autoFocus onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className={`text-sm leading-snug ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{item.text}</span>
        )}
      </div>
      
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-1 text-slate-500 hover:text-slate-300"><Edit3 size={11} /></button>
        <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_ITEM', listId, itemId: item.id }); }} className="p-1 text-slate-500 hover:text-rose-400"><Trash2 size={11} /></button>
      </div>
    </div>
  );
}

// List Card
function ListCard({ list, dispatch, isFocused, onFocus, selectedTaskId, onSelectTask }) {
  const [newItemText, setNewItemText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const colors = COLORS[list.color];
  const IconComponent = ICONS[list.icon] || Target;
  const totalItems = list.items.length;
  const completedItems = list.items.filter(i => i.completed).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItemText.trim()) { dispatch({ type: 'ADD_ITEM', listId: list.id, text: newItemText.trim() }); setNewItemText(''); }
  };

  return (
    <div className={`flex flex-col rounded-xl bg-slate-900/80 border ${colors.border} h-full transition-all ${list.dimmed ? 'opacity-40 hover:opacity-60' : ''} ${isFocused ? 'ring-2 ring-offset-1 ring-offset-slate-950 ring-blue-500/50' : ''}`}>
      <div className={`p-3.5 rounded-t-xl ${colors.bg} cursor-pointer`} onClick={() => onFocus(list.id)}>
        <div className="flex items-center gap-2.5">
          <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'TOGGLE_COLLAPSE', listId: list.id }); }} className={colors.text}>
            {list.collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>
          <div className={`p-1.5 rounded-lg ${colors.accent}`}><IconComponent size={14} className="text-white" /></div>
          <h3 className="flex-1 font-medium text-sm text-white truncate">{list.name}</h3>
          <span className={`text-xs ${colors.text}`}>{completedItems}/{totalItems}</span>
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} className="p-1 text-slate-400 hover:text-white"><MoreHorizontal size={14} /></button>
            {showSettings && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                <div className="absolute right-0 top-7 z-50 w-44 py-1.5 bg-slate-800 rounded-lg shadow-xl border border-slate-700 text-sm">
                  <button onClick={() => { dispatch({ type: 'TOGGLE_DOCK', listId: list.id }); setShowSettings(false); }} className="w-full px-3 py-1.5 text-left hover:bg-slate-700/50 flex items-center gap-2"><Minimize2 size={12} /> Dock</button>
                  <button onClick={() => { dispatch({ type: 'TOGGLE_DIM', listId: list.id }); setShowSettings(false); }} className="w-full px-3 py-1.5 text-left hover:bg-slate-700/50 flex items-center gap-2">{list.dimmed ? <Eye size={12} /> : <EyeOff size={12} />} {list.dimmed ? 'Unfade' : 'Fade'}</button>
                  <button onClick={() => { dispatch({ type: 'TOGGLE_PRIVATE', listId: list.id }); setShowSettings(false); }} className="w-full px-3 py-1.5 text-left hover:bg-slate-700/50 flex items-center gap-2"><Lock size={12} /> Move to Private</button>
                  <div className="my-1 border-t border-slate-700" />
                  <button onClick={() => { dispatch({ type: 'DELETE_LIST', listId: list.id }); setShowSettings(false); }} className="w-full px-3 py-1.5 text-left hover:bg-rose-500/10 flex items-center gap-2 text-rose-400"><Trash2 size={12} /> Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
        {!list.collapsed && totalItems > 0 && (
          <div className="mt-2.5 h-1 bg-slate-800/50 rounded-full overflow-hidden">
            <div className={`h-full ${colors.accent} transition-all`} style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      
      {!list.collapsed && (
        <>
          <div className="flex-1 overflow-y-auto p-1.5 min-h-0">
            {list.items.map(item => (
              <TaskItem key={item.id} item={item} listId={list.id} listColor={list.color} dispatch={dispatch} isSelected={selectedTaskId === item.id} onSelect={onSelectTask} />
            ))}
            {list.items.length === 0 && <div className="py-6 text-center text-slate-600 text-xs">No tasks yet</div>}
          </div>
          
          <form onSubmit={handleAddItem} className="p-2.5 border-t border-slate-800/50">
            <div className="flex gap-1.5">
              <input type="text" value={newItemText} onChange={(e) => setNewItemText(e.target.value)} placeholder="Add task..."
                className="flex-1 px-2.5 py-1.5 bg-slate-800/50 text-white rounded-lg text-sm border border-slate-700/50 focus:border-slate-600 focus:outline-none placeholder-slate-500"
              />
              <button type="submit" disabled={!newItemText.trim()} className={`px-2.5 ${colors.accent} rounded-lg text-white disabled:opacity-30`}><Plus size={16} /></button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

// Docked Stack
function DockedStack({ lists, dispatch }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (lists.length === 0) return <div className="text-slate-600 text-xs">No docked lists</div>;
  
  return (
    <div className="relative">
      {!isExpanded && (
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsExpanded(true)}>
          <div className="relative flex items-center">
            {lists.slice(0, 5).map((list, i) => {
              const colors = COLORS[list.color];
              const IconComponent = ICONS[list.icon] || Target;
              return (
                <div key={list.id}
                  className={`w-8 h-8 rounded-lg ${colors.accent} flex items-center justify-center border-2 border-slate-900 transition-transform group-hover:scale-105`}
                  style={{ marginLeft: i > 0 ? '-6px' : 0, zIndex: lists.length - i }}
                >
                  <IconComponent size={12} className="text-white" />
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-200 text-xs">
            <span>{lists.length} docked</span>
            <ChevronUp size={12} />
          </div>
        </div>
      )}
      
      {isExpanded && (
        <div className="absolute bottom-full left-0 mb-2 w-56 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
            <span className="text-xs font-medium text-slate-300">Docked Lists</span>
            <button onClick={() => setIsExpanded(false)} className="p-0.5 text-slate-400 hover:text-white"><X size={12} /></button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {lists.map(list => {
              const colors = COLORS[list.color];
              const IconComponent = ICONS[list.icon] || Target;
              return (
                <button key={list.id} onClick={() => { dispatch({ type: 'TOGGLE_DOCK', listId: list.id }); setIsExpanded(false); }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-slate-700/50 text-sm"
                >
                  <div className={`w-7 h-7 rounded-lg ${colors.accent} flex items-center justify-center`}>
                    <IconComponent size={10} className="text-white" />
                  </div>
                  <span className="flex-1 text-left truncate">{list.name}</span>
                  <span className="text-xs text-slate-500">{list.items.length}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Main App
export default function TaskBoard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showPrivateFolder, setShowPrivateFolder] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  
  // Filter lists: active (visible, not docked, not private), docked, private
  const activeLists = state.lists.filter(l => !l.docked && !l.private);
  const dockedLists = state.lists.filter(l => l.docked && !l.private);
  const privateLists = state.lists.filter(l => l.private);
  
  const totalItems = activeLists.reduce((acc, list) => acc + list.items.length, 0);
  const completedItems = activeLists.reduce((acc, list) => acc + list.items.filter(i => i.completed).length, 0);
  
  const handleOpenPrivate = () => {
    setShowSettings(false);
    setShowPinEntry(true);
  };
  
  const handlePinSubmit = (pin) => {
    if (pin === state.privatePin) {
      setShowPinEntry(false);
      setShowPrivateFolder(true);
      return true;
    }
    return false;
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (showPrivateFolder || showPinEntry || showSettings || showQuickAdd) return;
      
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setShowQuickAdd(true); }
      if (e.key === 'x' && selectedTaskId) {
        e.preventDefault();
        const list = state.lists.find(l => l.items.some(i => i.id === selectedTaskId));
        if (list) dispatch({ type: 'TOGGLE_ITEM', listId: list.id, itemId: selectedTaskId });
      }
      if (e.key === 'Escape') { setSelectedTaskId(null); dispatch({ type: 'CLEAR_FOCUS' }); }
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (activeLists[index]) dispatch({ type: 'SET_FOCUS', listId: activeLists[index].id });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTaskId, state.lists, activeLists, showPrivateFolder, showPinEntry, showSettings, showQuickAdd]);
  
  // If viewing private folder, show that instead
  if (showPrivateFolder) {
    return <PrivateFolderView lists={privateLists} dispatch={dispatch} onClose={() => setShowPrivateFolder(false)} />;
  }
  
  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      <header className="flex-shrink-0 px-5 py-3 bg-slate-900/50 border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-lg font-semibold">Tasks</h1>
              <p className="text-xs text-slate-500">{completedItems}/{totalItems} done</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${totalItems > 0 ? (completedItems / totalItems) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-slate-500">{totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0}%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSettings(true)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
              <Settings size={18} />
            </button>
            <button onClick={() => setShowQuickAdd(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 rounded-lg text-sm font-medium hover:bg-blue-600">
              <Plus size={16} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden p-4">
        <div className="h-full grid gap-3 auto-rows-fr" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {activeLists.map((list) => (
            <ListCard key={list.id} list={list} dispatch={dispatch}
              isFocused={state.focusedListId === list.id} onFocus={(id) => dispatch({ type: 'SET_FOCUS', listId: id })}
              selectedTaskId={selectedTaskId} onSelectTask={setSelectedTaskId}
            />
          ))}
          
          <button onClick={() => dispatch({ type: 'ADD_LIST' })}
            className="h-full min-h-28 rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-1.5 text-slate-600 hover:border-slate-700 hover:text-slate-500"
          >
            <Plus size={20} />
            <span className="text-xs font-medium">New List</span>
          </button>
        </div>
      </main>
      
      <footer className="flex-shrink-0 px-5 py-2.5 bg-slate-900/50 border-t border-slate-800/50">
        <div className="flex items-center justify-between">
          <DockedStack lists={dockedLists} dispatch={dispatch} />
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-600">
            <span><kbd className="px-1 py-0.5 bg-slate-800 rounded text-[10px]">n</kbd> add</span>
            <span><kbd className="px-1 py-0.5 bg-slate-800 rounded text-[10px]">x</kbd> done</span>
          </div>
        </div>
      </footer>
      
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onOpenPrivate={handleOpenPrivate}
        privateListCount={privateLists.length}
      />
      
      {/* PIN Entry for Private Folder */}
      {showPinEntry && (
        <PinEntry 
          title="Private" 
          subtitle="Enter PIN to access" 
          onSubmit={handlePinSubmit} 
          onCancel={() => setShowPinEntry(false)} 
        />
      )}
      
      {/* Quick Add */}
      <QuickAdd isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} lists={state.lists} dispatch={dispatch} />
    </div>
  );
}
