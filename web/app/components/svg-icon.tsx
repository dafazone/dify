'use client'
import { IconMap } from '@/app/constants/llm'
import { cn } from '@/app/utils/utils'
import Icon, { UserOutlined } from '@ant-design/icons'
import type { IconComponentProps } from '@ant-design/icons/lib/components/Icon'
import { Avatar } from 'antd'
import type { AvatarSize } from 'antd/es/avatar/AvatarContext'

const importAll = (requireContext: any) => {
  const list = requireContext.keys().map((key: any) => {
    const name = key.replace(/\.\/(.*)\.\w+$/, '$1')
    return { name, value: requireContext(key) }
  })
  return list
}

let routeList: { name: string; value: string }[] = []

try {
  routeList = importAll(require.context('../../assets/', true, /\.svg$/))
}
catch (error) {
  console.warn(error)
  routeList = []
}

console.log('routeList', routeList)

interface IProps extends IconComponentProps {
  name: string;
  width: string | number;
  height?: string | number;
  imgClass?: string;
}

const SvgIcon = ({ name, width, height, imgClass, ...restProps }: IProps) => {
  const ListItem: any = routeList.find(item => item.name === name)
  return (
    <Icon
      component={() => (
        <img
          src={ListItem?.value?.default?.src}
          alt=""
          width={width}
          height={height}
          className={cn(imgClass, 'max-w-full')}
        />
      )}
      {...(restProps as any)}
    />
  )
}

export const LlmIcon = ({
  name,
  height = 48,
  width = 48,
  size = 'large',
  imgClass,
}: {
  name: string;
  height?: number;
  width?: number;
  size?: AvatarSize;
  imgClass?: string;
}) => {
  const icon = IconMap[name as keyof typeof IconMap]

  return icon ? (
    <SvgIcon
      name={`llm/${icon}`}
      width={width}
      height={height}
      imgClass={imgClass}
    ></SvgIcon>
  ) : (
    <Avatar shape="square" size={size} icon={<UserOutlined />} />
  )
}

export default SvgIcon
