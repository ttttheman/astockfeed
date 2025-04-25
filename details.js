// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化平滑滚动效果
    initSmoothScroll();
    
    // 初始化图表
    initCharts();
    
    // 处理导航栏响应式布局
    handleNavigationLayout();
    
    // 监听窗口大小变化，重新计算导航栏布局
    window.addEventListener('resize', handleNavigationLayout);
});

// 页面平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('.section-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 获取导航栏高度以便于滚动位置的调整
                const navHeight = document.querySelector('.section-nav').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight - 20,
                    behavior: 'smooth'
                });
                
                // 更新URL但不刷新页面
                history.pushState(null, null, targetId);
            }
        });
    });
}

// 处理导航栏响应式布局
function handleNavigationLayout() {
    const navContainer = document.querySelector('.section-nav ul');
    const navItems = navContainer.querySelectorAll('li');
    const containerWidth = navContainer.offsetWidth;
    
    // 根据容器宽度调整导航布局
    if (containerWidth < 576) {
        // 在窄屏幕上，每行显示3个项目
        navItems.forEach(item => {
            item.style.flex = '0 0 30%';
        });
    } else if (containerWidth < 768) {
        // 在中等屏幕上，每行显示4个项目
        navItems.forEach(item => {
            item.style.flex = '0 0 22%';
        });
    } else if (containerWidth < 992) {
        // 在较大屏幕上，每行显示6个项目
        navItems.forEach(item => {
            item.style.flex = '0 0 16%';
        });
    } else {
        // 在大屏幕上，自动排列
        navItems.forEach(item => {
            item.style.flex = 'none';
        });
    }
}

// 初始化图表（实际项目中可以使用Chart.js、ECharts等库）
function initCharts() {
    // 这里是模拟图表实现，在实际项目中可以使用真实数据和图表库
    simulateChart('revenue-chart', '营业收入趋势(2020-2024)', ['2020', '2021', '2022', '2023', '2024']);
    simulateChart('profit-chart', '净利润趋势(2020-2024)', ['2020', '2021', '2022', '2023', '2024']);
    simulateChart('age-distribution-chart', '客户年龄分布', ['<25岁', '25-35岁', '35-45岁', '45-55岁', '>55岁']);
    simulateChart('region-distribution-chart', '客户地域分布', ['一线城市', '二线城市', '三四线城市', '县域', '农村']);
    simulateChart('shareholder-distribution-chart', '股东类型分布', ['国有法人', '境外法人', '个人', '机构', '其他']);
    simulateChart('forecast-chart', '业绩预测模型 (2024-2027)', ['2024', '2025', '2026', '2027']);
}

// 模拟图表渲染（实际项目中替换为真实图表库）
function simulateChart(elementId, title, labels) {
    const chartElement = document.getElementById(elementId);
    if (!chartElement) return;
    
    // 清除内容
    chartElement.innerHTML = '';
    chartElement.style.position = 'relative';
    
    // 添加标题
    const titleElement = document.createElement('div');
    titleElement.style.position = 'absolute';
    titleElement.style.top = '10px';
    titleElement.style.left = '10px';
    titleElement.style.fontSize = '0.9rem';
    titleElement.style.fontWeight = '500';
    titleElement.style.color = '#4a5568';
    titleElement.textContent = title;
    chartElement.appendChild(titleElement);
    
    // 添加轴标签
    const labelsContainer = document.createElement('div');
    labelsContainer.style.position = 'absolute';
    labelsContainer.style.bottom = '10px';
    labelsContainer.style.left = '0';
    labelsContainer.style.right = '0';
    labelsContainer.style.display = 'flex';
    labelsContainer.style.justifyContent = 'space-between';
    labelsContainer.style.padding = '0 20px';
    labelsContainer.style.fontSize = '0.8rem';
    labelsContainer.style.color = '#718096';
    
    labels.forEach(label => {
        const labelElement = document.createElement('span');
        labelElement.textContent = label;
        labelsContainer.appendChild(labelElement);
    });
    
    chartElement.appendChild(labelsContainer);
    
    // 添加"图表请在具体实现中使用真实图表库"提示
    const noteElement = document.createElement('div');
    noteElement.style.position = 'absolute';
    noteElement.style.top = '50%';
    noteElement.style.left = '50%';
    noteElement.style.transform = 'translate(-50%, -50%)';
    noteElement.style.color = '#a0aec0';
    noteElement.style.fontSize = '0.85rem';
    noteElement.style.textAlign = 'center';
    noteElement.style.width = '80%';
    noteElement.textContent = '图表示例 (实际项目中请使用Chart.js或ECharts等图表库)';
    chartElement.appendChild(noteElement);
}

// 添加当前章节高亮效果
function highlightCurrentSection() {
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.section-nav a');
    
    // 移除所有高亮
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 获取当前滚动位置
    const scrollPosition = window.scrollY;
    const navHeight = document.querySelector('.section-nav').offsetHeight;
    
    // 找出当前可见的章节
    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop - navHeight - 50 <= scrollPosition) {
            const id = section.getAttribute('id');
            document.querySelector(`.section-nav a[href="#${id}"]`).classList.add('active');
            break;
        }
    }
}

// 监听滚动事件，高亮当前章节
window.addEventListener('scroll', highlightCurrentSection);