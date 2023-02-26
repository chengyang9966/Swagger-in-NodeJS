module.exports = [{
    script: 'npm',
    args:'start',
    name: 'Sales X',
    instances: 1,
    out_file: "./logs/out/app.log",
    error_file: "./logs/error/error.log",
    merge_logs:true,
    log_type:"json"
  }]