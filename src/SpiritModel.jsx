import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function SpiritModel({ modelPath }) {
  const group = useRef();

  // 加载模型和动画
  const { scene, animations } = useGLTF(modelPath);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    console.log("🎬 加载模型:", modelPath);
    console.log("🎞️ 动作列表:", names);

    // 停止之前所有动作
    Object.values(actions).forEach((action) => {
      action?.stop?.();
    });

    // 找到合适的动作并播放
    const matchedName = names.find((name) => name.includes("Layer0")) || names[0];
    const action = actions[matchedName];

    if (action) {
      console.log("✅ 播放动作:", matchedName);
      action.reset().fadeIn(0.2).play();

      return () => {
        action.fadeOut(0.2).stop();
      };
    } else {
      console.warn("⚠️ 找不到可播放的动作");
    }
  }, [modelPath, actions, names]);

  return (
    <primitive object={scene} ref={group} scale={1.0} position={[0, -1, 0]} />
  );
}