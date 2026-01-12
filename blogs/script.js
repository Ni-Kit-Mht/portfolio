// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Blog data - in a real scenario, this could come from an API or JSON file
    const blogData = [
        {
            id: 1,
            title: "Stationery Writing Products",
            excerpt: "Exploring the best writing instruments from fountain pens to ballpoints and how they affect your writing experience.",
            category: "writing",
            date: "June 15, 2023",
            image: "https://images.unsplash.com/photo-1583484963886-cfe2bff2945f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "blogs/stationery_writing_products.html"
        },
        {
            id: 2,
            title: "Stationery Office Products",
            excerpt: "Essential office stationery items that boost productivity and organization in your workspace.",
            category: "office",
            date: "June 10, 2023",
            image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w-600&q=80",
            url: "blogs/stationery_office_products.html"
        },
        {
            id: 3,
            title: "Digital Note Taking vs Paper",
            excerpt: "Comparing digital and traditional note-taking methods and when to use each for optimal results.",
            category: "technology",
            date: "May 28, 2023",
            image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "blogs/digital_vs_paper_notes.html"
        },
        {
            id: 4,
            title: "Choosing the Right Notebook",
            excerpt: "A guide to selecting the perfect notebook based on paper quality, binding, size, and intended use.",
            category: "stationery",
            date: "May 20, 2023",
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "blogs/choosing_right_notebook.html"
        },
        {
            id: 5,
            title: "The Psychology of Handwriting",
            excerpt: "How handwriting affects cognitive processes, memory retention, and emotional expression.",
            category: "writing",
            date: "May 12, 2023",
            image: "./no-image.svg?auto=format&fit=crop&w=600&q=80",
            url: "blogs/psychology_of_handwriting.html"
        },
        {
            id: 6,
            title: "Eco-Friendly Office Supplies",
            excerpt: "Sustainable stationery options that reduce environmental impact without sacrificing quality.",
            category: "office",
            date: "April 30, 2023",
            image: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "blogs/eco_friendly_office_supplies.html"
        },
        {
            id: 7,
            title: "The Best Pens for Left-Handed Writers",
            excerpt: "A comprehensive review of pens that work well for left-handed individuals to prevent smudging.",
            category: "writing",
            date: "April 22, 2023",
            image: "./no-image.svg?auto=format&fit=crop&w=600&q=80",
            url: "blogs/pens_for_left_handed.html"
        },
        {
            id: 8,
            title: "Minimalist Workspace Setup",
            excerpt: "How to create a clean, distraction-free workspace with only essential stationery items.",
            category: "lifestyle",
            date: "April 15, 2023",
            image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "blogs/minimalist_workspace_setup.html"
        },
        {
            id: 9,
            title: "Ink Types and Their Properties",
            excerpt: "Understanding different ink types - dye-based, pigment, gel, and their characteristics.",
            category: "writing",
            date: "April 5, 2023",
            image: "./no-image.svg?auto=format&fit=crop&w=600&q=80",
            url: "blogs/ink_types_properties.html"
        },
        {
            id: 10,
            title: "Bullet Journaling for Productivity",
            excerpt: "How to use the bullet journal system to organize tasks, track habits, and boost productivity.",
            category: "lifestyle",
            date: "March 28, 2023",
            image: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "blogs/bullet_journaling_productivity.html"
        },
        {
            id: 11,
            title: "Vintage Typewriters in Modern Times",
            excerpt: "The resurgence of typewriters and how they're being used by writers and artists today.",
            category: "technology",
            date: "March 18, 2023",
            image: "./no-image.svg?auto=format&fit=crop&w=600&q=80",
            url: "blogs/vintage_typewriters_modern_times.html"
        },
        {
            id: 12,
            title: "Paper Quality and GSM Explained",
            excerpt: "Understanding paper weight, texture, and quality for different writing and printing needs.",
            category: "stationery",
            date: "March 10, 2023",
            image: "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "blogs/paper_quality_gsm_explained.html"
        },
        {
            id: 13,
            title: "Ergonomic Desk Accessories",
            excerpt: "Stationery and accessories designed to improve comfort and prevent strain during long work sessions.",
            category: "office",
            date: "February 25, 2023",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "blogs/ergonomic_desk_accessories.html"
        },
        {
            id: 14,
            title: "The History of the Pencil",
            excerpt: "Tracing the evolution of the pencil from its ancient origins to modern mechanical versions.",
            category: "stationery",
            date: "February 15, 2023",
            image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "blogs/history_of_pencil.html"
        },
        {
            id: 15,
            title: "Calligraphy for Beginners",
            excerpt: "Getting started with calligraphy: tools, techniques, and practice exercises for beautiful lettering.",
            category: "writing",
            date: "February 5, 2023",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            url: "blogs/calligraphy_for_beginners.html"
        }
    ];
    
    // Initialize counts
    document.getElementById('total-blogs').textContent = blogData.length;
    
    // Count unique categories
    const categories = [...new Set(blogData.map(blog => blog.category))];
    document.getElementById('total-categories').textContent = categories.length;
    
    // Render blog cards
    const blogsContainer = document.getElementById('blogs-container');
    
    function renderBlogs(blogs) {
        blogsContainer.innerHTML = '';
        
        if (blogs.length === 0) {
            document.getElementById('no-results').style.display = 'block';
            return;
        }
        
        document.getElementById('no-results').style.display = 'none';
        
        blogs.forEach(blog => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            
            // Format category for display
            const categoryDisplay = blog.category.charAt(0).toUpperCase() + blog.category.slice(1);
            
            blogCard.innerHTML = `
                <div class="blog-image">
                    <img src="${blog.image}" alt="${blog.title}">
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${blog.title}</h3>
                    <p class="blog-excerpt">${blog.excerpt}</p>
                    <div class="blog-meta">
                        <span class="category-tag category-${blog.category}">${categoryDisplay}</span>
                        <span class="blog-date">${blog.date}</span>
                    </div>
                    <a href="${blog.url}" class="read-btn">Read Article</a>
                </div>
            `;
            
            blogsContainer.appendChild(blogCard);
        });
    }
    
    // Initial render
    renderBlogs(blogData);
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    function filterAndSortBlogs() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const sortOption = sortFilter.value;
        
        let filteredBlogs = blogData.filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(searchTerm) || 
                                  blog.excerpt.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        // Sort blogs based on selected option
        switch(sortOption) {
            case 'newest':
                filteredBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filteredBlogs.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'title-asc':
                filteredBlogs.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                filteredBlogs.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
        
        renderBlogs(filteredBlogs);
    }
    
    // Event listeners for filtering and sorting
    searchInput.addEventListener('input', filterAndSortBlogs);
    categoryFilter.addEventListener('change', filterAndSortBlogs);
    sortFilter.addEventListener('change', filterAndSortBlogs);
    
    // Category links in footer
    document.querySelectorAll('.category-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            categoryFilter.value = category;
            filterAndSortBlogs();
            
            // Scroll to blogs section
            document.querySelector('.blogs-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Simulate typing effect for search placeholder
    let placeholderText = "Search blog posts by title or keyword...";
    let placeholderIndex = 0;
    let isDeleting = false;
    let placeholderSpeed = 100;
    
    function typePlaceholder() {
        const currentText = isDeleting 
            ? placeholderText.substring(0, placeholderIndex - 1)
            : placeholderText.substring(0, placeholderIndex + 1);
        
        searchInput.placeholder = currentText;
        placeholderIndex = isDeleting ? placeholderIndex - 1 : placeholderIndex + 1;
        
        if (!isDeleting && placeholderIndex === placeholderText.length) {
            // Pause at end
            setTimeout(() => isDeleting = true, 1500);
            return;
        }
        
        if (isDeleting && placeholderIndex === 0) {
            isDeleting = false;
            // Restart the cycle after a pause
            setTimeout(typePlaceholder, 500);
            return;
        }
        
        const speed = isDeleting ? placeholderSpeed / 2 : placeholderSpeed;
        setTimeout(typePlaceholder, speed);
    }
    
    // Start typing effect after page loads
    setTimeout(typePlaceholder, 1000);
});