// https://github.com/npm/rfcs/issues/325

const fs = require("fs");
// const { spawn } = require("child_process");

const isMatchUsedPkgName = (usedPkgName) => {
  const userAgent = process.env.npm_config_user_agent;
  const [useInstallPkgName] = userAgent.split(" ");
  const [pkgName] = useInstallPkgName.split("/");
  return [pkgName === usedPkgName, usedPkgName];
};

const getArgv = () => {
  const [useInstallPkgName] = process.argv.slice(2);
  return useInstallPkgName;
};

const deleteFile = ([isDelete, usedPkgName]) => {
  console.log(isDelete, usedPkgName);
  if (!isDelete) {
    const filePath = `${process.cwd()}/pnpm-lock.yaml`;
    fs.unlinkSync(filePath);
    throw new Error(`\x1B[41;30m  请使用 ${usedPkgName} 进行安装依赖  \x1B[0m`);

    // const deleteNodeModules = `${__dirname}/node_modules`;
    // const ls = spawn("rm", ["-rf", deleteNodeModules]);

    // ls.on("close", (code) => {
    //   if (code === 0) {
    //     console.log("目录删除成功");
    //   } else {
    //     console.error("删除目录时发生错误");
    //   }
    // });
  }
};

const compose = (...fns) => {
  return fns.reduce((a, b) => {
    return (...args) => {
      return a(b(...args));
    };
  });
};

compose(deleteFile, isMatchUsedPkgName, getArgv)();
