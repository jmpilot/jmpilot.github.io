function help(email, username, hotelname, createtime) {
    // Include the UserVoice JavaScript SDK (only needed once on a page)
    UserVoice = window.UserVoice || [];
    (function () {
        var uv = document.createElement('script');
        uv.type = 'text/javascript';
        uv.async = true;
        uv.src = '//widget.uservoice.com/sat3TAinQEdJskUGgRqYhQ.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(uv, s)
    })();
    //
    // UserVoice Javascript SDK developer documentation:
    // https://www.uservoice.com/o/javascript-sdk
    //
    // Set colors
    UserVoice.push(['set', {
        accent_color: '#7dc4d3',
        trigger_color: 'white',
        trigger_background_color: '#6fe175'
    }]);
    // Identify the user and pass traits
    // To enable, replace sample data with actual user traits and uncomment the line
    UserVoice.push(['identify', {
        email: email, // Userâ€™s email address
        name: username, // Userâ€™s real name
        created_at: createtime, // Unix timestamp for the date the user signed up
//id: 123, // Optional: Unique id of the user (if set, this should not change)
//type: 'Owner', // Optional: segment your users by type
        account: {
// id: 123, // Optional: associate multiple users with a single account
            name: hotelname, // Account name
            created_at: createtime // Unix timestamp for the date the account was created
// monthly_rate: 9.99, // Decimal; monthly rate of the account
// ltv: 1495.00, // Decimal; lifetime value of the account
// plan: 'Enhanced' // Plan name for the account
        }
    }]);
    // Add default trigger to the top-left corner of the window:
    //    UserVoice.push(['addTrigger', {mode: 'contact', trigger_position: 'top-left' }]);
    // Or, use your own custom trigger:
//    UserVoice.push(['addTrigger', '#help', {mode: 'satisfaction'}]);
    UserVoice.push(['addTrigger', '#help', {mode: 'contact'}]);
    // Autoprompt for Satisfaction and SmartVote (only displayed under certain conditions)
    UserVoice.push(['autoprompt', {}]);
}
