"use client";

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Minus, Maximize2, Calculator as CalcIcon, Delete, Equal, Percent, Divide, Plus, Minus as MinusIcon, X as MultiIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Calculator() {
  const { calculatorState, setCalculatorState } = useAppContext();
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  if (calculatorState === 'closed') return null;

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setIsNewNumber(true);
  };

  const calculate = () => {
    try {
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation('');
      setIsNewNumber(true);
    } catch (e) {
      setDisplay('Error');
      setEquation('');
      setIsNewNumber(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const buttons = [
    { label: 'C', action: clear, variant: 'outline' as const, className: 'text-red-500' },
    { label: '%', action: () => handleOperator('%'), variant: 'outline' as const },
    { label: '÷', action: () => handleOperator('/'), variant: 'secondary' as const },
    { label: '7', action: () => handleNumber('7') },
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    { label: '×', action: () => handleOperator('*'), variant: 'secondary' as const },
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    { label: '-', action: () => handleOperator('-'), variant: 'secondary' as const },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    { label: '+', action: () => handleOperator('+'), variant: 'secondary' as const },
    { label: '0', action: () => handleNumber('0'), className: 'col-span-2' },
    { label: '.', action: () => handleNumber('.') },
    { label: '=', action: calculate, variant: 'default' as const, className: 'bg-primary' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          right: 20,
          bottom: calculatorState === 'minimized' ? 20 : 80
        }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed z-50 w-72 shadow-2xl"
      >
        <Card className="border-primary/20 overflow-hidden">
          <CardHeader className="py-2 px-4 bg-primary text-primary-foreground flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <CalcIcon className="w-4 h-4" />
              <CardTitle className="text-xs font-bold uppercase tracking-wider">Calculadora</CardTitle>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 hover:bg-white/20 text-white"
                onClick={() => setCalculatorState(calculatorState === 'minimized' ? 'open' : 'minimized')}
              >
                {calculatorState === 'minimized' ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 hover:bg-white/20 text-white"
                onClick={() => setCalculatorState('closed')}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          
          {calculatorState === 'open' && (
            <CardContent className="p-4 bg-muted/30">
              <div className="bg-white rounded-lg p-3 mb-4 text-right shadow-inner border">
                <div className="text-[10px] text-muted-foreground h-4 font-mono">{equation}</div>
                <div className="text-2xl font-bold font-mono truncate">{display}</div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {buttons.map((btn, i) => (
                  <Button
                    key={i}
                    variant={btn.variant || 'ghost'}
                    className={`h-10 font-bold ${btn.className || ''}`}
                    onClick={btn.action}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
