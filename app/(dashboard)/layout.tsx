import Sidebar from "@/components/Sidebar/Sidebar"

const DashboardLayout = ({
    children
} : {
    children: React.ReactNode 
}) => {
    return (
        <>
            <Sidebar />
            {children}
        </>
    )
}

export default DashboardLayout