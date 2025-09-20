/**
 * Template management for R1 Creations Builder
 */

class TemplateManager {
    constructor() {
        this.templates = [];
        this.categories = [];
        this.currentFilter = 'all';
        this.setupEventListeners();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Templates modal
        const templatesBtn = document.getElementById('templatesBtn');
        const templatesModal = document.getElementById('templatesModal');
        const closeTemplatesModal = document.getElementById('closeTemplatesModal');
        
        if (templatesBtn) {
            templatesBtn.addEventListener('click', () => this.showTemplatesModal());
        }
        
        if (closeTemplatesModal) {
            closeTemplatesModal.addEventListener('click', () => this.hideTemplatesModal());
        }
        
        if (templatesModal) {
            templatesModal.addEventListener('click', (e) => {
                if (e.target === templatesModal) {
                    this.hideTemplatesModal();
                }
            });
        }
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterTemplates(category);
            });
        });
    }
    
    /**
     * Show templates modal
     */
    async showTemplatesModal() {
        const modal = document.getElementById('templatesModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Load templates if not already loaded
            if (this.templates.length === 0) {
                await this.loadTemplates();
            }
            
            this.renderTemplates();
        }
    }
    
    /**
     * Hide templates modal
     */
    hideTemplatesModal() {
        const modal = document.getElementById('templatesModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
    
    /**
     * Load templates from server
     */
    async loadTemplates() {
        try {
            showLoading('Loading templates...');
            
            const response = await fetch('/api/templates/list');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to load templates');
            }
            
            this.templates = result.templates;
            
            // Load categories
            await this.loadCategories();
            
        } catch (error) {
            console.error('Error loading templates:', error);
            showToast('Failed to load templates', 'error');
            
            // Fallback to sample templates
            this.loadSampleTemplates();
        } finally {
            hideLoading();
        }
    }
    
    /**
     * Load template categories
     */
    async loadCategories() {
        try {
            const response = await fetch('/api/templates/categories');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    this.categories = result.categories;
                    console.log('Categories loaded:', this.categories);
                }
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }
    
    /**
     * Load sample templates as fallback
     */
    loadSampleTemplates() {
        this.templates = [
            {
                id: 'hello_world',
                name: 'Hello World',
                description: 'Simple greeting creation that responds to voice commands',
                category: 'beginner',
                tags: ['voice', 'speech', 'basic']
            },
            {
                id: 'timer_reminder',
                name: 'Timer Reminder',
                description: 'Set reminders that trigger at regular intervals',
                category: 'productivity',
                tags: ['timer', 'notification', 'reminder']
            },
            {
                id: 'tilt_controller',
                name: 'Tilt Controller',
                description: 'Control actions by tilting the R1 device',
                category: 'sensors',
                tags: ['accelerometer', 'tilt', 'gesture']
            }
        ];
    }
    
    /**
     * Filter templates by category
     */
    filterTemplates(category) {
        this.currentFilter = category;
        
        // Update filter button states
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            }
        });
        
        this.renderTemplates();
    }
    
    /**
     * Render templates in the grid
     */
    renderTemplates() {
        const grid = document.getElementById('templatesGrid');
        if (!grid) return;
        
        // Filter templates
        let filteredTemplates = this.templates;
        if (this.currentFilter !== 'all') {
            filteredTemplates = this.templates.filter(template => 
                template.category === this.currentFilter
            );
        }
        
        // Clear grid
        grid.innerHTML = '';
        
        // Render templates
        filteredTemplates.forEach(template => {
            const templateCard = this.createTemplateCard(template);
            grid.appendChild(templateCard);
        });
        
        // Show message if no templates
        if (filteredTemplates.length === 0) {
            const message = document.createElement('div');
            message.className = 'no-templates';
            message.innerHTML = `
                <p>No templates found for category "${this.currentFilter}"</p>
                <p>Try selecting a different category or check back later.</p>
            `;
            grid.appendChild(message);
        }
    }
    
    /**
     * Create template card element
     */
    createTemplateCard(template) {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.setAttribute('data-template-id', template.id);
        
        card.innerHTML = `
            <h3>${template.name}</h3>
            <p>${template.description}</p>
            <div class="template-tags">
                ${template.tags.map(tag => `<span class="template-tag">${tag}</span>`).join('')}
            </div>
        `;
        
        card.addEventListener('click', () => this.loadTemplate(template.id));
        
        return card;
    }
    
    /**
     * Load a specific template
     */
    async loadTemplate(templateId) {
        try {
            showLoading('Loading template...');
            
            const response = await fetch(`/api/templates/${templateId}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to load template');
            }
            
            const template = result.template;
            
            // Confirm loading if workspace has content
            const currentWorkspace = BlocklyConfig.workspace();
            if (currentWorkspace && currentWorkspace.getAllBlocks().length > 0) {
                const confirmed = confirm(
                    `Load template "${template.name}"? This will replace the current workspace.`
                );
                if (!confirmed) {
                    return;
                }
            }
            
            // Load template workspace
            if (template.workspace_xml) {
                BlocklyConfig.loadXml(template.workspace_xml);
            }
            
            // Update creation name
            const nameInput = document.getElementById('creationName');
            if (nameInput) {
                nameInput.value = template.name;
            }
            
            showToast(`Template "${template.name}" loaded`, 'success');
            this.hideTemplatesModal();
            
        } catch (error) {
            console.error('Error loading template:', error);
            showToast(`Failed to load template: ${error.message}`, 'error');
        } finally {
            hideLoading();
        }
    }
    
    /**
     * Create a new custom template from current workspace
     */
    async createCustomTemplate() {
        const currentWorkspace = BlocklyConfig.workspace();
        if (!currentWorkspace || currentWorkspace.getAllBlocks().length === 0) {
            showToast('Create some blocks first before saving as template', 'warning');
            return;
        }
        
        const name = prompt('Enter template name:');
        if (!name) return;
        
        const description = prompt('Enter template description:') || '';
        const category = prompt('Enter template category (beginner/productivity/sensors/interaction/advanced):') || 'custom';
        
        try {
            const workspaceXml = BlocklyConfig.getXml();
            const templateData = {
                name: name,
                description: description,
                category: category,
                workspace_xml: workspaceXml,
                tags: ['custom'],
                created_at: new Date().toISOString()
            };
            
            // In a real implementation, you would save this to the server
            // For now, we'll save to localStorage
            const customTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
            templateData.id = `custom_${Date.now()}`;
            customTemplates.push(templateData);
            localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
            
            // Add to current templates
            this.templates.push(templateData);
            
            showToast('Custom template created', 'success');
            this.renderTemplates();
            
        } catch (error) {
            console.error('Error creating template:', error);
            showToast('Failed to create template', 'error');
        }
    }
    
    /**
     * Load custom templates from localStorage
     */
    loadCustomTemplates() {
        try {
            const customTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
            this.templates = [...this.templates, ...customTemplates];
            console.log('Custom templates loaded:', customTemplates);
        } catch (error) {
            console.error('Error loading custom templates:', error);
        }
    }
    
    /**
     * Get template by ID
     */
    getTemplateById(templateId) {
        return this.templates.find(template => template.id === templateId);
    }
    
    /**
     * Search templates
     */
    searchTemplates(query) {
        if (!query) {
            return this.templates;
        }
        
        const lowerQuery = query.toLowerCase();
        return this.templates.filter(template => 
            template.name.toLowerCase().includes(lowerQuery) ||
            template.description.toLowerCase().includes(lowerQuery) ||
            template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
}

// Initialize template manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.templateManager = new TemplateManager();
    
    // Load custom templates
    window.templateManager.loadCustomTemplates();
    
    // Add search functionality if search input exists
    const searchInput = document.getElementById('templateSearch');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value;
                const results = window.templateManager.searchTemplates(query);
                // Update display with search results
                console.log('Search results:', results);
            }, 300);
        });
    }
});

// Export for global access
window.TemplateManager = TemplateManager;
