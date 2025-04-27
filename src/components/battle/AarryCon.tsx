import { FC, useState } from 'react';
const AarryCon: FC = ({ roles }) => {
    const [roleAarry, setRoleAarry] = useState({

    });
    const [roleFlat, setRoleFlat] = useState([]);
    const [curRole, setCurRole] = useState({
        type: "",
        id: "",
        avatar: ""
    })
    const setPo = (role: { type?: string; id: any; }, index: number, type: string | number) => {
        if (!role) return setCurRole({})
        if (!curRole.id) return setRoleAarry({
            ...roleAarry,
            [type]: {
                ...(roleAarry[type] || []),
                [index]: {},
            }
        })
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
    return (
        <div className='absolute flex flex-col w-full h-full left-0 top-0  z-6 p-4' style={{ ["box-sizing"]: "border-box", background: 'rgb(29 29 29 / 99%)' }} onClick={() => setCurRole({})}>
            <div className='w-full  flex flex-1' >
                {
                    roles.map((item, key) => (
                        <div className='flex gap-4 h-full flex-1 items-center justify-around' style={{ flexDirection: key ? "row-reverse" : "" }}>
                            <div className='flex flex-col gap-2'>
                                <span>角色数： {item.length}</span>
                                <div className='grid grid-cols-4 grid-rows-6 w-80 h-120 gap-0'>
                                    {item.map(role => (
                                        <div className='flex justify-center items-center aspect-square rd-full  border-box p-2 cursor-pointer border-1 border-solid border-transparent'
                                            style={{ borderColor: curRole.id === role.id ? "orange" : "transparent" }}
                                            onClick={(e) => (e.stopPropagation(), setCurRole({
                                                type: key,
                                                id: role.id,
                                                avatar: role.avatar
                                            }))} >
                                            <img style={{ ["object-fit"]: "cover" }} src={role.avatar} draggable={false} className='w-full h-full  rd-full' />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className='grid grid-cols-3 grid-rows-3 w-90 h-90 gap-4'>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                        <div className=' flex justify-center hover:border-amber-500 items-center cursor-pointer aspect-square  border-white border-1 border-solid  rd-full' onClick={() => setPo(curRole, i, key)}>
                                            {roleAarry[key] && roleAarry[key][i] && roleAarry[key][i].id && <img style={{ ["object-fit"]: "cover" }} src={roleAarry[key][i].avatar} draggable={false} className='w-full h-full  rd-full' />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='text-center'>
                <span className='text-lg cursor-pointer'>确定阵容</span>
            </div>
        </div>
    );
};

export default AarryCon; 