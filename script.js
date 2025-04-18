// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.top-list-tabs .tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show the selected tab content
            if (index === 0) {
                document.getElementById('limit-up-content').style.display = 'block';
            } else {
                document.getElementById('longhu-content').style.display = 'block';
            }
        });
    });
    
    // Performance sorting functionality
    const performanceSort = document.getElementById('performance-sort');
    if (performanceSort) {
        performanceSort.addEventListener('change', function() {
            // In a real implementation, this would reorder the cards
            // based on the selected sort option
            console.log('Sort changed to: ' + this.value);
            
            // Simulate reordering with a page refresh
            // In production, this would use AJAX or DOM manipulation
            // to avoid a full page reload
            // window.location.href = window.location.href.split('?')[0] + '?sort=' + this.value;
        });
    }

    // 为所有股票卡片添加收藏图标
    document.querySelectorAll('.performance-card, .spotlight-card').forEach(card => {
        const code = card.getAttribute('onclick').match(/code=(\d+)/)?.[1];
        const name = card.querySelector('.stock-name, h4').textContent;
        
        const icon = document.createElement('svg');
        icon.className = 'watch-icon';
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none'); // 默认为空心
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '2');
        icon.setAttribute('data-code', code); // 添加股票代码属性，方便后续查找
        // 心形图标路径
        icon.innerHTML = '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>';
        icon.onclick = (e) => {
            e.stopPropagation();
            toggleWatchlist(code, name, icon);
        };
        
        card.appendChild(icon);
    });

    // 分享功能相关
    const shareButton = document.querySelector('.share-button');
    const shareOptions = document.querySelector('.share-options');
    
    if (shareButton && shareOptions) {
        shareButton.addEventListener('click', function() {
            shareOptions.classList.toggle('active');
        });
        
        // 点击页面其他地方关闭分享选项
        document.addEventListener('click', function(e) {
            if (!shareButton.contains(e.target) && !shareOptions.contains(e.target)) {
                shareOptions.classList.remove('active');
            }
        });
        
        // 实现分享功能
        document.querySelectorAll('.share-option').forEach(option => {
            option.addEventListener('click', function() {
                const platform = this.getAttribute('data-platform');
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent('每日投资机会速递');
                let shareUrl = '';
                
                if (platform === 'wechat') {
                    // 微信分享通常需要使用微信SDK，这里仅作示例
                    alert('请使用微信扫描二维码分享');
                } else if (platform === 'qq') {
                    shareUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}`;
                    window.open(shareUrl);
                } else if (platform === 'weibo') {
                    shareUrl = `http://service.weibo.com/share/share.php?url=${url}&title=${title}`;
                    window.open(shareUrl);
                } else if (platform === 'qzone') {
                    shareUrl = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}&title=${title}`;
                    window.open(shareUrl);
                }
                
                // 关闭分享选项
                shareOptions.classList.remove('active');
            });
        });
    }

    // 收藏图标点击事件
    document.querySelectorAll('.watch-icon').forEach(icon => {
        const code = icon.getAttribute('data-code');
        const name = icon.closest('.stock-signal-card, .fundamental-card, .performance-card, .spotlight-card')?.querySelector('.stock-signal-name, .stock-name, h4')?.textContent.trim();
        
        if (code && name) {
            icon.onclick = (e) => {
                e.stopPropagation();
                toggleWatchlist(code, name, icon);
            };
        }
    });
    
    // 修复信号标签的工具提示显示
    document.querySelectorAll('.signal-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            const tooltip = this.querySelector('.signal-tooltip');
            if (tooltip) {
                tooltip.style.display = 'block';
            }
        });
        
        tag.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.signal-tooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        });
    });
});

// 添加收藏功能相关代码
const watchlist = new Set();
const maxWatchlistSize = 9;

function toggleWatchlist(code, name, icon) {
    const card = icon.closest('.performance-card, .spotlight-card, .watchlist-card');
    const isInWatchlist = watchlist.has(code);
    
    if (isInWatchlist) {
        watchlist.delete(code);
        
        // 将所有相同代码的图标更新为未收藏状态
        document.querySelectorAll('.watch-icon').forEach(starIcon => {
            if (starIcon.getAttribute('data-code') === code) {
                starIcon.classList.remove('active');
                starIcon.setAttribute('fill', 'none');
            }
        });
        
        removeFromWatchlist(code);
    } else {
        if (watchlist.size >= maxWatchlistSize) {
            alert('收藏夹已满，最多可收藏9只股票');
            return;
        }
        
        watchlist.add(code);
        
        // 将所有相同代码的图标更新为收藏状态
        document.querySelectorAll('.watch-icon').forEach(starIcon => {
            if (starIcon.getAttribute('data-code') === code) {
                starIcon.classList.add('active');
                starIcon.setAttribute('fill', 'currentColor');
            }
        });
        
        addToWatchlist(code, name, card);
    }
    
    updateWatchlistCount();
}

function addToWatchlist(code, name, sourceCard) {
    const watchlistCards = document.getElementById('watchlist-cards');
    const emptyMessage = document.getElementById('watchlist-empty');
    
    if (emptyMessage) {
        emptyMessage.remove();
    }
    
    const card = document.createElement('div');
    card.className = 'watchlist-card';
    card.setAttribute('onclick', `window.location.href='stock-detail.html?code=${code}'`);
    
    // 创建一个完全与原卡片相同风格的复制品
    card.innerHTML = `
        <svg class="watch-icon active" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" data-code="${code}" onclick="event.stopPropagation(); toggleWatchlist('${code}', '${name}', this)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <div class="stock-chart">
            ${sourceCard.querySelector('.stock-chart').innerHTML}
        </div>
        <div class="stock-performance-header">
            <div class="stock-name-code">
                <h4>${name}</h4>
                <div class="suggested-date">推荐日: ${sourceCard.querySelector('.suggested-date')?.textContent || '2025/03/28'}</div>
            </div>
            <div class="total-return positive">${sourceCard.querySelector('.total-return')?.textContent || '+20.5%'}</div>
        </div>
        <div class="metrics-grid">
            ${sourceCard.querySelector('.metrics-grid').innerHTML}
        </div>
    `;
    
    watchlistCards.appendChild(card);
    
    // 为新添加的收藏图标添加事件监听
    const watchIcon = card.querySelector('.watch-icon');
    watchIcon.onclick = (e) => {
        e.stopPropagation();
        toggleWatchlist(code, name, watchIcon);
    };
}

function removeFromWatchlist(code) {
    const watchlistCards = document.getElementById('watchlist-cards');
    // 使用更可靠的选择器找到要删除的卡片
    const cards = watchlistCards.querySelectorAll('.watchlist-card');
    let cardToRemove = null;
    
    for (const card of cards) {
        const stockCode = card.querySelector('.stock-name-code')?.textContent.match(/\d+/)?.[0];
        if (stockCode === code) {
            cardToRemove = card;
            break;
        }
    }
    
    if (cardToRemove) {
        cardToRemove.remove();
    }
    
    if (watchlistCards.children.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'watchlist-empty';
        emptyMessage.id = 'watchlist-empty';
        emptyMessage.textContent = '点击股票卡片上的收藏图标，将股票添加到收藏区';
        watchlistCards.appendChild(emptyMessage);
    }
}

function updateWatchlistCount() {
    const countElement = document.getElementById('watchlist-count');
    if (countElement) {
        countElement.textContent = watchlist.size;
    }
}