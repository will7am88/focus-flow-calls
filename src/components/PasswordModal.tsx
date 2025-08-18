import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PasswordModalProps {
  isOpen: boolean;
  onSubmit: (password: string) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string;
  required?: boolean;
}

export function PasswordModal({
  isOpen,
  onSubmit,
  onCancel,
  title = "Enter Room Password",
  description = "This room is password protected. Please enter the password to join.",
  isLoading = false,
  error,
  required = true
}: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    // Clear password when modal closes
    if (!isOpen) {
      setPassword('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onSubmit(password.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !required && onCancel) {
      onCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={required ? undefined : onCancel}>
      <DialogContent 
        className="sm:max-w-md bg-card border border-border shadow-large"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <DialogTitle className="text-xl font-semibold text-center">
            {title}
          </DialogTitle>
          
          <DialogDescription className="text-center text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              
              <Input
                ref={inputRef}
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter room password"
                className="pl-10 pr-10 h-12"
                disabled={isLoading}
                autoComplete="off"
                autoFocus
              />
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-10 w-10 p-0 hover:bg-surface"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-destructive mt-2 animate-fade-in">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            {!required && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={!password.trim() || isLoading}
              className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              {isLoading ? 'Verifying...' : 'Join Room'}
            </Button>
          </div>

          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Your connection is secure and encrypted</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}