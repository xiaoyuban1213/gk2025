$(function() {
    // 获取高考日期（每年6月7日 09:00:00）
    function getGaokaoDate() {
        const now = new Date();
        let year = now.getFullYear();
        // 设置今年高考时间为6月7日 09:00:00
        const currentGaokao = new Date(year, 5, 7, 9, 0, 0);
        
        // 如果当前时间已过今年高考时间，使用下一年
        if (now > currentGaokao) {
            year += 1;
        }
        
        // 返回下个高考时间（含具体时间）
        return new Date(year, 5, 7, 9, 0, 0);
    }

    // 格式化日期为插件需要的格式（YYYY/MM/DD HH:mm:ss）
    function formatDate(date) {
        const pad = n => String(n).padStart(2, '0');
        return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    // 更新标题函数
    function updateTitles(targetDate) {
        const year = targetDate.getFullYear();
        document.title = `${year}年高考倒计时-高考加油`;
        document.querySelector('.countdown-title').textContent = `${year}年高考倒计时`;
    }

    const $countdowns = $('.countdown');
    
    if ($.isFunction($.fn.countdown)) {
        $countdowns.each(function() {
            const $container = $(this);
            
            // 创建DOM结构
            const template = `
                <div class="countdown-box">
                    <h4 class="countdown-number js-days">00</h4>
                    <h4 class="countdown-title">天</h4>
                </div>
                <div class="countdown-box">
                    <h4 class="countdown-number js-hours">00</h4>
                    <h4 class="countdown-title">时</h4>
                </div>
                <div class="countdown-box">
                    <h4 class="countdown-number js-minutes">00</h4>
                    <h4 class="countdown-title">分</h4>
                </div>
                <div class="countdown-box">
                    <h4 class="countdown-number js-seconds">00</h4>
                    <h4 class="countdown-title">秒</h4>
                </div>
            `;
            $container.html(template);

            const elements = {
                days: $container.find('.js-days'),
                hours: $container.find('.js-hours'),
                minutes: $container.find('.js-minutes'),
                seconds: $container.find('.js-seconds')
            };

            function initCountdown() {
                const targetDate = getGaokaoDate();
                updateTitles(targetDate);

                // 销毁旧实例（如果存在）
                if ($container.data('countdown')) {
                    $container.countdown('remove');
                }

                // 初始化倒计时（使用格式化后的时间字符串）
                $container.countdown({
                    date: formatDate(targetDate),
                    render: function(data) {
                        elements.days.text(String(data.days).padStart(2, '0'));
                        elements.hours.text(String(data.hours).padStart(2, '0'));
                        elements.minutes.text(String(data.min).padStart(2, '0'));
                        elements.seconds.text(String(data.sec).padStart(2, '0'));
                    },
                    onExpiry: function() {
                        console.log('倒计时结束，正在重新初始化...');
                        setTimeout(() => {
                            initCountdown(); // 重新初始化
                        }, 1000); // 延迟1秒再重新初始化，避免频繁触发
                    }
                });
            }

            initCountdown();
        });
    } else {
        console.error('倒计时插件未加载，请检查是否正确引入插件');
    }
});