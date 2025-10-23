// Logger for debugging
class Logger {
    constructor() {
        this.logs = [];
        this.startTime = new Date();
    }
    
    log(level, category, message, data = null) {
        const timestamp = new Date();
        const elapsed = timestamp - this.startTime;
        
        const logEntry = {
            time: timestamp.toISOString(),
            elapsed: `${elapsed}ms`,
            level,
            category,
            message,
            data: data ? JSON.stringify(data, null, 2) : null
        };
        
        this.logs.push(logEntry);
        
        // Console output with emoji
        const emoji = {
            'INFO': 'ℹ️',
            'SUCCESS': '✅',
            'ERROR': '❌',
            'WARNING': '⚠️',
            'DEBUG': '🔍'
        }[level] || '📝';
        
        console.log(`${emoji} [${category}] ${message}`, data || '');
        
        // Auto-save to localStorage
        this.save();
    }
    
    info(category, message, data) {
        this.log('INFO', category, message, data);
    }
    
    success(category, message, data) {
        this.log('SUCCESS', category, message, data);
    }
    
    error(category, message, data) {
        this.log('ERROR', category, message, data);
    }
    
    warning(category, message, data) {
        this.log('WARNING', category, message, data);
    }
    
    debug(category, message, data) {
        this.log('DEBUG', category, message, data);
    }
    
    save() {
        try {
            localStorage.setItem('admin_logs', JSON.stringify(this.logs));
        } catch (e) {
            console.error('Cannot save logs to localStorage:', e);
        }
    }
    
    download() {
        const content = this.logs.map(log => {
            return `[${log.time}] [${log.elapsed}] [${log.level}] [${log.category}] ${log.message}${log.data ? '\n' + log.data : ''}`;
        }).join('\n\n');
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-logs-${new Date().toISOString().replace(/:/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    clear() {
        this.logs = [];
        this.startTime = new Date();
        localStorage.removeItem('admin_logs');
        console.clear();
    }
    
    getReport() {
        return {
            totalLogs: this.logs.length,
            errors: this.logs.filter(l => l.level === 'ERROR').length,
            warnings: this.logs.filter(l => l.level === 'WARNING').length,
            success: this.logs.filter(l => l.level === 'SUCCESS').length,
            duration: `${new Date() - this.startTime}ms`,
            logs: this.logs
        };
    }
}

// Global logger instance
window.logger = new Logger();
window.logger.info('LOGGER', 'Система логування ініціалізована');






