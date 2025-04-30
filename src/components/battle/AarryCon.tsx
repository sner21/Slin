import { FC, useEffect, useState } from 'react';
import tw, { styled } from "twin.macro";
import ReactMarkdown from 'react-markdown';
import { elementColors, getMirrorPosition } from '../../common';
import cloneDeep from 'lodash-es/cloneDeep';
import { isNumber } from 'lodash-es';



const BreatheDiv = styled.div`
${tw`flex justify-center flex-col items-center p-4`}
/* animation: breathe 2s ease-in-out infinite; */

@keyframes breathe {
  0%, 100% {
    border-color: rgb(251 191 36 / 0.3);
    box-shadow: 0 0 10px rgb(251 191 36 / 0.3);
  }
  50% {
    border-color: rgb(251 191 36);
    box-shadow: 0 0 20px rgb(251 191 36 / 0.8),
                inset 0 0 10px rgb(251 191 36 / 0.5);
  }
}
`;
const BreatheImg = styled.img`
${tw`flex justify-center flex-col items-center`}
box-sizing:border-box;
@keyframes breatheFit {
    0%, 100% {
        /* border:0px; */
        /* border-color:transparent; */
        /* border-color: rgb(251 191 36); */
    box-shadow: 0 0 20px rgb(251 191 36 / 0.8),
                inset 0 0 10px rgb(251 191 36 / 0.5);
  }
  50% {
    /* border:0px; */
    /* border-color:transparent; */
    /* border-color: rgb(251 191 36); */
    box-shadow: 0 0 20px rgb(251 191 36 / 0.8),
                inset 0 0 10px rgb(251 191 36 / 0.5);
  }
}
`;

const AarryCon: FC = ({ roles, onConfirm, roleAarryData }) => {
    const [roleAarry, setRoleAarry] = useState(roleAarryData || {});
    const [roleData, setRoleData] = useState(roles || []);
    const [roleFlat, setRoleFlat] = useState([]);
    const [p, setP] = useState(null);
    const [curRole, setCurRole] = useState<{
        type?: string,
        id?: string,
        avatar?: string,
        device?: number
        data?: any
        index?: number
    }>({
        type: "",
        id: "",
        avatar: "",
        device: 0,
        data: null,
    })
    const handleConfirm = () => {
        onConfirm(roleData, roleAarry)
    }
    const setPo = (role: { type?: string; id: any; }, index: number, type: string) => {
        setP(null)
        if (curRole.id && type !== curRole.type) return
        if (!role) selectRole(role, type, index)
        if (!curRole.id) {
            const device = roleData[type].findIndex(i => i.id === role.id)
            device >= 0 && selectRole(role, type, device, index)
            console.log(p, 333)
            setP(role)
        }
        // if (!curRole.id) return setRoleAarry({
        //     ...roleAarry,
        //     [type]: {
        //         ...(roleAarry[type] || []),
        //         [index]: {},
        //     }
        // })
        if (curRole.id) {
            const a = {}
            roleAarry[type] && Object.keys(roleAarry[type]).forEach((key) => {
                if (roleAarry[type][key]?.id === role.id) {
                    a[type] = {
                        [key]: roleAarry[type][index] || {},
                    }
                    if (isNumber(role.index)) {
                        a[type][key].index = role.index
                    }
                }
            })

            setRoleAarry({
                ...roleAarry,
                [type]: {
                    ...(roleAarry[type] || []),
                    ...a[type],
                    [index]: {
                        id: role.id,
                        type: type,
                        avatar: role.avatar,
                        data: role.data || role,
                        index,
                    },

                }
            })
            setCurRole({})
        }


    }
    const selectRole = (role: never, key: string, device: number, index: number) => {
        setP(null)
        const r = {
            type: key,
            id: role.id,
            avatar: role.avatar,
            device: device,
            data: role.data || role,
            index,
        }
        setCurRole(r)
        return r
    }
    const switchRole = (e: { stopPropagation: () => void; }, type: string) => {
        e.stopPropagation()
        if (!curRole.id) return
        if (type !== curRole.type) {
            const list = [...roleData]
            list[curRole.type].splice(curRole.device, 1)
            list[type].push({ ...curRole.data, type: type + "" })
            setRoleData(list)
            const a = {}
            Object.keys(roleAarry[curRole.type]).forEach((key) => {
                if (roleAarry[curRole.type][key].id === curRole.id) {
                    console.log(roleAarry[curRole.type][key], curRole, 22)
                    a[curRole.type] = {
                        ...roleAarry[curRole.type],
                        [key]: {}
                    }
                }
            })
            setRoleAarry({
                ...roleAarry,
                ...a,
            })
        } else if (p) {
            const a = {}
            Object.keys(roleAarry[curRole.type]).forEach((key) => {
                if (roleAarry[curRole.type][key].id === curRole.id) {
                    // roleAarry[curRole.type][key].index = null
                    console.log(roleAarry[curRole.type][key],roleAarry, curRole, 22)
                    a[curRole.type] = {
                        ...roleAarry[curRole.type],
                        [key]: {}
                    }
                }
            })

            setRoleAarry({
                ...roleAarry,
                ...a,
            })
        }
        setCurRole({})
    }


    return (
        <div className=' flex flex-col h-full left-0 h-full top-0  z-6 ' style={{ ["box-sizing"]: "border-box", }} onClick={() => setCurRole({})}>
            <div>
                <div className=' text-center   items-center justify-center mt-2'>
                    {/* <div>前排单位有30%概率直接攻击后排</div>
                    <div>当找不到理想目标时会随机选择</div>
                    <div>现在暂时可以将单位直接调整到对方</div> */}
                    <ReactMarkdown>
                        {`
前排单位有30%概率直接攻击后排

当找不到理想目标时会随机选择

现在暂时可以将单位直接调整到对方
  `}
                    </ReactMarkdown>
                </div>
            </div>
            <div className='w-full  flex flex-1 ' >
                {
                    roleData.map((item, key) => (
                        <div className='flex gap-4 h-full flex-1 items-center justify-around' style={{ flexDirection: key ? "row-reverse" : "" }}>
                            <BreatheDiv className='flex flex-col gap-2 rd-md' style={{ "animation": curRole.id && (curRole.type !== key || p) ? "breathe 2s ease-in-out infinite" : "" }}>
                                <span>角色数： {item.length}</span>
                                <div className='grid grid-cols-4 grid-rows-5 w-80 h-100 gap-0' onClick={(e) => switchRole(e, key)}>
                                    {item?.map((role, index) => (
                                        <div className='flex justify-center items-center aspect-square rd-full  border-box p-2 cursor-pointer border-1 border-solid border-transparent'
                                            onClick={(e) => (e.stopPropagation(), selectRole(role, key, index))} >
                                            <BreatheImg style={{
                                                ["object-fit"]: "cover", filter: `drop-shadow(2px 4px 12px black)`, border: `${elementColors[role.element]} 1px solid`, boxShadow: curRole.id === role.id ? `0 0 20px ${elementColors[role.element]}, inset 0 0 10px ${elementColors[role.element]} ` : ""
                                            }}
                                                src={role.avatar} draggable={false} className='w-full h-full  rd-full' />
                                        </div>
                                    ))}
                                </div>
                            </BreatheDiv>
                            <div>
                                <div className='grid grid-cols-3 grid-rows-3 w-90 h-90 gap-4 p-8 rd-xl' onClick={(e) => (e.stopPropagation())} style={{ "animation": curRole.id && curRole.type === key ? "breathe 2s ease-in-out infinite" : "" }}>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                        <div style={{ filter: `drop-shadow(2px 4px 12px black)` }} className=' flex justify-center hover:border-amber-500 items-center cursor-pointer aspect-square  border-white border-5 border-solid  rd-full'
                                            onClick={(e) => (e.stopPropagation(), setPo(curRole.id ? curRole : roleAarry[key][i], i, key))} >
                                            {roleAarry[key] && roleAarry[key][i] && roleAarry[key][i].id && <img style={{ ["object-fit"]: "cover", filter: `drop-shadow(2px 4px 12px black)` }} src={roleAarry[key][i].avatar} draggable={false} className='w-full h-full  rd-full' />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='flex justify-center  text-center h-16  mb-6'>
                <div className='flex justify-center items-center   w-100 text-2xl cursor-pointer hover:color-amber  hover:border-amber border-dashed' onClick={() => handleConfirm()}>确定阵容</div>
            </div>


        </div>
    );
};

export default AarryCon; 