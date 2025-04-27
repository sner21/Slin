import { FC, useState } from 'react';
import tw, { styled } from "twin.macro";
import ReactMarkdown from 'react-markdown';



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

@keyframes breatheFit {
    0%, 100% {
        border-color: rgb(251 191 36);
    box-shadow: 0 0 20px rgb(251 191 36 / 0.8),
                inset 0 0 10px rgb(251 191 36 / 0.5);
  }
  50% {
    border-color: rgb(251 191 36);
    box-shadow: 0 0 20px rgb(251 191 36 / 0.8),
                inset 0 0 10px rgb(251 191 36 / 0.5);
  }
}
`;
const AarryCon: FC = ({ roles, onConfirm }) => {
    const [roleAarry, setRoleAarry] = useState({});
    const [roleData, setRoleData] = useState(roles || []);
    const [roleFlat, setRoleFlat] = useState([]);
    const [curRole, setCurRole] = useState<{
        type?: string,
        id?: string,
        avatar?: string,
        index?: number
        data?: any
    }>({
        type: "",
        id: "",
        avatar: "",
        index: 0,
        data: null
    })
    const handleConfirm = () => {
        onConfirm(roleData, roleAarry)
    }
    const setPo = (role: { type?: string; id: any; }, index: number, type: string) => {
        if (curRole.id && type !== curRole.type) return
        if (!role) selectRole(role, type, index)
        if (!curRole.id) {
            selectRole(role, type, index)
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
                if (roleAarry[type][key].id === role.id) {
                    a[type] = {
                        [key]: {}
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
                        avatar: role.avatar
                    },

                }
            })
            setCurRole({})
        }


    }
    const selectRole = (role: never, key: string, index: number) => {
        const r = {
            type: key,
            id: role.id,
            avatar: role.avatar,
            index: index,
            data: role
        }
        setCurRole(r)
        return r
    }
    const switchRole = (e: { stopPropagation: () => void; }, type: string) => {
        e.stopPropagation()
        if (!curRole.id) return
        if (type !== curRole.type) {
            const list = [...roleData]
            list[curRole.type].splice(curRole.index, 1)
            list[type].push(curRole.data)
            setRoleData(list)
            setCurRole({})
        }
    }


    return (
        <div className='absolute flex flex-col w-full h-full left-0 top-0  z-6 p-4' style={{ ["box-sizing"]: "border-box", background: 'rgb(29 29 29 / 99%)' }} onClick={() => setCurRole({})}>
            <div>
                <div className='text-center h-20  items-center justify-center'>
                    <ReactMarkdown>
                        {`
敌人会优先前排（靠近对方）的单位

现在暂时可以将单位直接调整到对方
  `}
                    </ReactMarkdown>
                </div>
            </div>
            <div className='w-full  flex flex-1' >
                {
                    roleData.map((item, key) => (
                        <div className='flex gap-4 h-full flex-1 items-center justify-around' style={{ flexDirection: key ? "row-reverse" : "" }}>
                            <BreatheDiv className='flex flex-col gap-2 ' style={{ "animation": curRole.id && curRole.type !== key ? "breathe 2s ease-in-out infinite" : "" }}>
                                <span>角色数： {item.length}</span>
                                <div className='grid grid-cols-4 grid-rows-6 w-80 h-120 gap-0' onClick={(e) => switchRole(e, key)}>
                                    {item?.map((role, index) => (
                                        <div className='flex justify-center items-center aspect-square rd-full  border-box p-2 cursor-pointer border-1 border-solid border-transparent'
                                            onClick={(e) => (e.stopPropagation(), selectRole(role, key, index))} >
                                            <BreatheImg style={{
                                                ["object-fit"]: "cover", filter: `drop-shadow(2px 4px 12px black)`, animation: curRole.id === role.id ? "breatheFit 2s ease-in-out infinite" : ""
                                            }}
                                                src={role.avatar} draggable={false} className='w-full h-full  rd-full' />
                                        </div>
                                    ))}
                                </div>
                            </BreatheDiv>
                            <div>
                                <div className='grid grid-cols-3 grid-rows-3 w-90 h-90 gap-4 p-4' onClick={(e) => (e.stopPropagation())} style={{ "animation": curRole.id && curRole.type === key ? "breathe 2s ease-in-out infinite" : "" }}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                        <div style={{ filter: `drop-shadow(2px 4px 12px black)` }} className=' flex justify-center hover:border-amber-500 items-center cursor-pointer aspect-square  border-white border-1 border-solid  rd-full'
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
            <div className='text-center'>
                <span className='text-lg cursor-pointer' onClick={() => handleConfirm}>确定阵容</span>
            </div>


        </div>
    );
};

export default AarryCon; 