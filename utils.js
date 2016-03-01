module.exports = {
  isDarwin: function(){
    return (process.platform === "darwin");
  },
  isLinux: function(){
    return (process.platform === "linux");
  },
  isWindows: function(){
    return (process.platform === "win32");
  }
}
