// ==========================================
// 1. DATA STORES (State Management)
// ==========================================
let todos = JSON.parse(localStorage.getItem('todos')) || [];

const products = [
    { id: 1, name: "Mechanical Gaming Keyboard", category: "electronics", price: 120, img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60" },
    { id: 2, name: "Wireless Ergonomic Mouse", category: "electronics", price: 80, img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60" },
    { id: 3, name: "UltraWide 4K Monitor", category: "electronics", price: 450, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60" },
    { id: 4, name: "Premium Leather Jacket", category: "apparel", price: 250, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60" },
    { id: 5, name: "Minimalist Canvas Backpack", category: "apparel", price: 65, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60" },
    { id: 6, name: "Adjustable Smart Dumbbells", category: "fitness", price: 320, img: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&auto=format&fit=crop&q=60" },
    { id: 7, name: "High-Speed Running Shoes", category: "fitness", price: 110, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60" },
    { id: 8, name: "Noise-Cancelling Headphones", category: "electronics", price: 350, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" }
];

// ==========================================
// 2. UTILITY COMPONENTS (Toasts & Global)
// ==========================================
function showToast(message, type = 'primary') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'danger' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-progress').style.width = scrolled + "%";

    const bttButton = document.getElementById('back-to-top');
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        bttButton.style.display = "flex";
    } else {
        bttButton.style.display = "none";
    }
});

document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    showToast(`Switched to ${newTheme} mode`, 'primary');
});

const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// ==========================================
// 3. TO-DO MANAGER APPLICATION
// ==========================================
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');
const todoSearch = document.getElementById('todo-search');
const todoFilter = document.getElementById('todo-filter');
const clearAllTodosBtn = document.getElementById('clear-all-todos');

function saveAndRenderTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = '';
    const searchQuery = todoSearch.value.toLowerCase();
    const filterValue = todoFilter.value;

    let filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.text.toLowerCase().includes(searchQuery);
        if (filterValue === 'completed') return matchesSearch && todo.completed;
        if (filterValue === 'pending') return matchesSearch && !todo.completed;
        return matchesSearch;
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li style="text-align:center;color:var(--text-muted);padding:20px;">No matching tasks found.</li>';
        return;
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span>${todo.text}</span>
            <div class="todo-item-actions">
                <button class="todo-complete-btn" onclick="toggleTodo(${todo.id})"><i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i></button>
                <button class="todo-edit-btn" onclick="editTodo(${todo.id})"><i class="fas fa-edit"></i></button>
                <button class="todo-del-btn" onclick="deleteTodo(${todo.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

addTodoBtn.addEventListener('click', () => {
    const taskText = todoInput.value.trim();
    if (!taskText) return showToast('Task field cannot be blank!', 'danger');
    todos.push({ id: Date.now(), text: taskText, completed: false });
    todoInput.value = '';
    saveAndRenderTodos();
    showToast('Task added successfully!');
});

window.toggleTodo = (id) => {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRenderTodos();
};

window.deleteTodo = (id) => {
    todos = todos.filter(t => t.id !== id);
    saveAndRenderTodos();
    showToast('Task removed.', 'danger');
};

window.editTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    const newText = prompt("Update your task text:", todo.text);
    if (newText && newText.trim() !== '') {
        todo.text = newText.trim();
        saveAndRenderTodos();
        showToast('Task updated');
    }
};

clearAllTodosBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all tasks?')) {
        todos = [];
        saveAndRenderTodos();
        showToast('All tasks cleared.', 'danger');
    }
});

todoSearch.addEventListener('input', renderTodos);
todoFilter.addEventListener('change', renderTodos);

// ==========================================
// 4. PRODUCT LISTING MODULE
// ==========================================
const productGrid = document.getElementById('product-grid');
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const priceValue = document.getElementById('price-value');
const sortFilter = document.getElementById('sort-filter');

priceFilter.addEventListener('input', () => {
    priceValue.textContent = priceFilter.value;
    renderProducts();
});

function renderProducts() {
    productGrid.innerHTML = '';
    const catVal = categoryFilter.value;
    const maxPrice = parseFloat(priceFilter.value);
    const sortVal = sortFilter.value;

    let processedProducts = products.filter(p => {
        const matchesCategory = catVal === 'all' || p.category === catVal;
        const matchesPrice = p.price <= maxPrice;
        return matchesCategory && matchesPrice;
    });

    if (sortVal === 'price-low') processedProducts.sort((a, b) => a.price - b.price);
    else if (sortVal === 'price-high') processedProducts.sort((a, b) => b.price - a.price);
    else if (sortVal === 'name-asc') processedProducts.sort((a, b) => a.name.localeCompare(b.name));

    if (processedProducts.length === 0) {
        productGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding:40px;">No items match filters.</div>';
        return;
    }

    processedProducts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'glass-card product-card';
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-tag">${p.category}</span>
                <h4>${p.name}</h4>
                <div class="product-meta">
                    <span class="product-price">$${p.price}</span>
                    <button class="btn primary-btn" style="padding: 6px 12px; font-size:0.85rem;" onclick="showToast('Added ${p.name.replace(/'/g, "\\'")} to cart!')">Buy Now</button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

[categoryFilter, sortFilter].forEach(el => el.addEventListener('input', renderProducts));

// ==========================================
// 5. CONTACT & INITIALIZATION
// ==========================================
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message routed successfully!');
    e.target.reset();
});

document.getElementById('download-resume').addEventListener('click', (e) => {
    showToast('Downloading resume portfolio file...', 'primary');
});

document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    renderProducts();
});
